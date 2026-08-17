import type { ChangeEvent, RefObject, SubmitEvent } from 'react'
import type { Mock } from 'vitest'

import { act, renderHook } from '@testing-library/react'

import type { FileUploadState, PendingFileUpload } from './startUpload'
import type { ExistingFile } from './useFileUploads'

import { startServerActionUpload } from './startServerActionUpload'
import { startUpload } from './startUpload'
import { useFileUploads } from './useFileUploads'

vi.mock('./startUpload', () => ({
  startUpload: vi.fn(),
}))

vi.mock('./startServerActionUpload', () => ({
  startServerActionUpload: vi.fn(),
}))

const createChangeEvent = (files: File[] | null) =>
  ({ currentTarget: { files } }) as unknown as ChangeEvent<HTMLInputElement>

const createInputRef = () => ({ current: { value: '' } }) as unknown as RefObject<HTMLInputElement | null>

const deleteAttachmentMock = vi.fn()

const defaultParams = {
  deleteAttachment: deleteAttachmentMock,
  existingFiles: [] as ExistingFile[],
  idPrefix: 'upload',
  maxSuccessfulUploads: 3,
  maxUploadAttempts: 10,
  uploadUrl: 'https://example.com/upload',
}

describe('useFileUploads', () => {
  describe('initial state', () => {
    it('returns no file uploads, generic error or deleted file name when there are no existing files', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      expect(result.current.fileUploads).toEqual([])
      expect(result.current.genericError).toBeUndefined()
      expect(result.current.deletedFileName).toBeUndefined()
    })

    it('maps an existing file with a blob to a successful upload', () => {
      const existingFiles: ExistingFile[] = [{ blob: new Blob(['content']), fileName: 'test.png', serverId: 1 }]

      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, existingFiles, inputRef: createInputRef() }),
      )

      expect(result.current.fileUploads).toEqual([
        { file: expect.any(File), id: 'upload-1', progress: 100, serverId: 1, status: 'success' },
      ])
      expect(result.current.fileUploads[0].file.name).toBe('test.png')
    })

    it('maps an existing file without a blob to a file name placeholder', () => {
      const existingFiles: ExistingFile[] = [{ blob: undefined, fileName: 'test.png', serverId: 1 }]

      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, existingFiles, inputRef: createInputRef() }),
      )

      expect(result.current.fileUploads[0].file).toEqual({ name: 'test.png' })
    })
  })

  describe('handleUpload', () => {
    it('does nothing when there are no files', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent(null))
      })

      expect(result.current.fileUploads).toEqual([])
      expect(startUpload).not.toHaveBeenCalled()
    })

    it('adds a pending upload, opens the upload URL and starts the upload', () => {
      const openSpy = vi.spyOn(XMLHttpRequest.prototype, 'open')
      const inputRef = createInputRef()
      const file = new File(['content'], 'test.png')

      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([file]))
      })

      expect(result.current.fileUploads).toHaveLength(1)
      expect(result.current.fileUploads[0]).toMatchObject({ file, progress: 0, status: 'pending' })
      expect(openSpy).toHaveBeenCalledWith('POST', defaultParams.uploadUrl)
      expect(startUpload).toHaveBeenCalledWith(expect.objectContaining({ file, id: 'upload-1' }), expect.any(Function))

      openSpy.mockRestore()
    })

    it('clears the file input value after starting uploads', () => {
      const inputRef = createInputRef()
      inputRef.current!.value = 'C:\\fakepath\\test.png'

      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      expect(inputRef.current!.value).toBe('')
    })

    it('clears an existing generic error when a new upload starts', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef, maxUploadAttempts: 1 }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      expect(result.current.genericError?.title).toBe('errors.too-many-attempts.title')

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['c'], 'c.png')]))
      })

      expect(result.current.genericError).toBeUndefined()
    })

    it('sets a too-many-attempts error and does not add files when exceeding maxUploadAttempts', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef, maxUploadAttempts: 1 }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      expect(result.current.genericError).toEqual({
        description: 'errors.too-many-attempts.description',
        title: 'errors.too-many-attempts.title',
      })
      expect(result.current.fileUploads).toEqual([])
      expect(startUpload).not.toHaveBeenCalled()
    })

    it('sets a too-many-files error and does not add files when exceeding maxSuccessfulUploads', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef, maxSuccessfulUploads: 1 }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      expect(result.current.genericError).toEqual({
        options: { maxFiles: 1 },
        title: 'errors.too-many-files.title',
      })
      expect(result.current.fileUploads).toEqual([])
      expect(startUpload).not.toHaveBeenCalled()
    })

    it('marks a duplicate file as an error without starting a second upload', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      expect(result.current.fileUploads).toHaveLength(2)
      expect(result.current.fileUploads[1]).toMatchObject({
        errorMessage: 'validation-errors.duplicate-upload',
        status: 'error',
      })
      expect(startUpload).toHaveBeenCalledTimes(1)
    })
  })

  describe('uploadFile adapter', () => {
    const uploadFileMock = vi.fn()

    const uploadFileParams = {
      deleteAttachment: deleteAttachmentMock,
      existingFiles: [] as ExistingFile[],
      idPrefix: 'upload',
      maxSuccessfulUploads: 3,
      maxUploadAttempts: 10,
      uploadFile: uploadFileMock,
    }

    it('starts the upload via the adapter instead of opening an XHR', () => {
      const openSpy = vi.spyOn(XMLHttpRequest.prototype, 'open')
      const inputRef = createInputRef()
      const file = new File(['content'], 'test.png')

      const { result } = renderHook(() => useFileUploads({ ...uploadFileParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([file]))
      })

      expect(result.current.fileUploads).toHaveLength(1)

      expect(openSpy).not.toHaveBeenCalled()

      expect(startServerActionUpload).toHaveBeenCalledWith(
        expect.objectContaining({ file, id: 'upload-1' }),
        uploadFileMock,
        expect.any(Function),
      )

      expect(startUpload).not.toHaveBeenCalled()

      openSpy.mockRestore()
    })

    it('reports supportsUploadCancellation as false when using the uploadFile adapter', () => {
      const { result } = renderHook(() => useFileUploads({ ...uploadFileParams, inputRef: createInputRef() }))

      expect(result.current.supportsUploadCancellation).toBe(false)
    })

    it('reports supportsUploadCancellation as true when using uploadUrl', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      expect(result.current.supportsUploadCancellation).toBe(true)
    })
  })

  describe('handleDelete', () => {
    it('aborts an in-progress upload and removes it from the list', () => {
      // startUpload is mocked, so the XMLHttpRequest will never reach the sent state.
      // We make use of that in this test.
      const inputRef = createInputRef()
      const abortSpy = vi.spyOn(XMLHttpRequest.prototype, 'abort').mockImplementation(() => {})

      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      const upload = result.current.fileUploads[0] as PendingFileUpload

      act(() => {
        result.current.handleDelete(upload.id, 'test.png', upload.xhr)
      })

      expect(abortSpy).toHaveBeenCalled()
      expect(result.current.fileUploads).toEqual([])
      expect(result.current.deletedFileName).toBe('test.png')

      abortSpy.mockRestore()
    })

    it('removes an upload without a server id without calling deleteAttachment', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      const upload = result.current.fileUploads[0]

      act(() => {
        result.current.handleDelete(upload.id, 'test.png')
      })

      expect(deleteAttachmentMock).not.toHaveBeenCalled()
      expect(result.current.fileUploads).toEqual([])
      expect(result.current.deletedFileName).toBe('test.png')
    })

    it('calls deleteAttachment and removes the upload on success', async () => {
      deleteAttachmentMock.mockResolvedValueOnce({ error: undefined })

      const existingFiles: ExistingFile[] = [{ blob: undefined, fileName: 'test.png', serverId: 42 }]
      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, existingFiles, inputRef: createInputRef() }),
      )

      await act(async () => {
        await result.current.handleDelete('upload-1', 'test.png', undefined, 42)
      })

      expect(deleteAttachmentMock).toHaveBeenCalledWith(42)
      expect(result.current.fileUploads).toEqual([])
      expect(result.current.deletedFileName).toBe('test.png')
    })

    it('sets a delete-failed generic error and keeps the upload when deleteAttachment fails', async () => {
      deleteAttachmentMock.mockResolvedValueOnce({ error: 'API error' })

      const existingFiles: ExistingFile[] = [{ blob: undefined, fileName: 'test.png', serverId: 42 }]
      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, existingFiles, inputRef: createInputRef() }),
      )

      await act(async () => {
        await result.current.handleDelete('upload-1', 'test.png', undefined, 42)
      })

      expect(result.current.genericError).toEqual({
        description: 'errors.delete-failed.description',
        title: 'errors.delete-failed.title',
      })
      expect(result.current.fileUploads).toHaveLength(1)
    })
  })

  describe('handleSubmit', () => {
    it('prevents submission and sets an error when an upload is in progress', () => {
      ;(startUpload as Mock).mockImplementationOnce((upload, setFileUploads) => {
        setFileUploads((prev: FileUploadState[]) =>
          prev.map((u) => (u.id === upload.id ? { ...u, status: 'uploading' } : u)),
        )
      })

      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      const preventDefault = vi.fn()

      act(() => {
        result.current.handleSubmit({ preventDefault } as unknown as SubmitEvent<HTMLFormElement>)
      })

      expect(preventDefault).toHaveBeenCalled()
      expect(result.current.genericError).toEqual({
        description: 'errors.upload-in-progress.description',
        title: 'errors.upload-in-progress.title',
      })
    })

    it('allows submission when no upload is in progress', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      const preventDefault = vi.fn()

      act(() => {
        result.current.handleSubmit({ preventDefault } as unknown as SubmitEvent<HTMLFormElement>)
      })

      expect(preventDefault).not.toHaveBeenCalled()
      expect(result.current.genericError).toBeUndefined()
    })
  })
})
