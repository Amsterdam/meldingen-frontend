import type { ChangeEvent, RefObject, SubmitEvent } from 'react'
import type { Mock } from 'vitest'

import { act, renderHook } from '@testing-library/react'

import type { ExistingFile, FileUploadState, PendingFileUpload } from './types'

import { startUpload } from './startUpload'
import { UPLOAD_RESULT_GROUPING_MS, useFileUploads } from './useFileUploads'

vi.mock('./startUpload', () => ({
  startUpload: vi.fn(),
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
    it('returns no file uploads, generic error or announcement when there are no existing files', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      expect(result.current.fileUploads).toEqual([])
      expect(result.current.genericError).toBeUndefined()
      expect(result.current.announcement).toBeUndefined()
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
      expect(startUpload).toHaveBeenCalledWith(
        expect.objectContaining({ file, id: 'upload-1' }),
        expect.any(Function),
        { onError: expect.any(Function), onSuccess: expect.any(Function) },
      )

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

    it('marks a file larger than maxFileSizeBytes as an error without uploading it', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef, maxFileSizeBytes: 5 }))

      act(() => {
        result.current.handleUpload(
          createChangeEvent([new File(['12345'], 'max-size.png'), new File(['123456'], 'too-large.png')]),
        )
      })

      expect(result.current.fileUploads[0]).toMatchObject({ file: { name: 'max-size.png' }, status: 'pending' })
      expect(result.current.fileUploads[1]).toMatchObject({
        errorMessage: 'validation-errors.file-too-large',
        file: { name: 'too-large.png' },
        status: 'error',
      })
      expect(startUpload).toHaveBeenCalledTimes(1)
    })

    it('does not check the file size when maxFileSizeBytes is not set', () => {
      const inputRef = createInputRef()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'.repeat(1024)], 'large.png')]))
      })

      expect(result.current.fileUploads[0]).toMatchObject({ status: 'pending' })
      expect(startUpload).toHaveBeenCalledTimes(1)
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
      expect(result.current.announcement?.events).toEqual([{ fileNames: ['test.png'], type: 'cancelled' }])

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
      expect(result.current.announcement?.events).toEqual([{ fileNames: ['test.png'], type: 'deleted' }])
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
      expect(result.current.announcement?.events).toEqual([{ fileNames: ['test.png'], type: 'deleted' }])
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

  describe('announcement', () => {
    type UploadCallbacks = { onError: () => void; onSuccess: () => void }

    // Collects the callbacks the hook passes to startUpload, so a test can finish uploads when it wants
    const captureUploadCallbacks = () => {
      const callbacks: UploadCallbacks[] = []

      ;(startUpload as Mock).mockImplementation((_upload, _setFileUploads, uploadCallbacks: UploadCallbacks) => {
        callbacks.push(uploadCallbacks)
      })

      return callbacks
    }

    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      ;(startUpload as Mock).mockReset()
      vi.useRealTimers()
    })

    it('announces all started uploads of one selection in a single announcement', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      expect(result.current.announcement).toEqual({
        events: [{ fileNames: ['a.png', 'b.png'], type: 'upload-started' }],
        id: 1,
      })
    })

    it('leaves files with a validation error out of the started announcement', () => {
      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, inputRef: createInputRef(), maxFileSizeBytes: 5 }),
      )

      act(() => {
        result.current.handleUpload(
          createChangeEvent([new File(['12345'], 'max-size.png'), new File(['123456'], 'too-large.png')]),
        )
      })

      expect(result.current.announcement?.events).toEqual([{ fileNames: ['max-size.png'], type: 'upload-started' }])
    })

    it('does not announce a start when every selected file has a validation error', () => {
      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, inputRef: createInputRef(), maxFileSizeBytes: 5 }),
      )

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['123456'], 'too-large.png')]))
      })

      expect(result.current.announcement).toBeUndefined()
    })

    it('groups uploads that succeed close together into one announcement', () => {
      const callbacks = captureUploadCallbacks()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      act(() => {
        callbacks[0].onSuccess()
        vi.advanceTimersByTime(UPLOAD_RESULT_GROUPING_MS - 1)
        callbacks[1].onSuccess()
      })

      // Still the started announcement, because the grouping time restarts with every finished upload
      expect(result.current.announcement?.events[0].type).toBe('upload-started')

      act(() => {
        vi.advanceTimersByTime(UPLOAD_RESULT_GROUPING_MS)
      })

      expect(result.current.announcement?.events).toEqual([{ fileNames: ['a.png', 'b.png'], type: 'upload-succeeded' }])
    })

    it('announces uploads that succeed further apart separately', () => {
      const callbacks = captureUploadCallbacks()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      act(() => {
        callbacks[0].onSuccess()
        vi.advanceTimersByTime(UPLOAD_RESULT_GROUPING_MS)
      })

      expect(result.current.announcement?.events).toEqual([{ fileNames: ['a.png'], type: 'upload-succeeded' }])

      act(() => {
        callbacks[1].onSuccess()
        vi.advanceTimersByTime(UPLOAD_RESULT_GROUPING_MS)
      })

      expect(result.current.announcement?.events).toEqual([{ fileNames: ['b.png'], type: 'upload-succeeded' }])
    })

    it('announces a failed upload', () => {
      const callbacks = captureUploadCallbacks()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png')]))
      })

      act(() => {
        callbacks[0].onError()
        vi.advanceTimersByTime(UPLOAD_RESULT_GROUPING_MS)
      })

      expect(result.current.announcement?.events).toEqual([{ fileNames: ['a.png'], type: 'upload-failed' }])
    })

    it('combines uploads that succeed and fail close together into one announcement', () => {
      const callbacks = captureUploadCallbacks()
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png'), new File(['b'], 'b.png')]))
      })

      act(() => {
        callbacks[0].onError()
        callbacks[1].onSuccess()
        vi.advanceTimersByTime(UPLOAD_RESULT_GROUPING_MS)
      })

      expect(result.current.announcement?.events).toEqual([
        { fileNames: ['b.png'], type: 'upload-succeeded' },
        { fileNames: ['a.png'], type: 'upload-failed' },
      ])
    })

    it('gives a repeated identical message a new id, so it can be announced again', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      act(() => {
        result.current.handleDelete(result.current.fileUploads[0].id, 'test.png')
      })

      const firstDeleteId = result.current.announcement?.id

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['content'], 'test.png')]))
      })

      act(() => {
        result.current.handleDelete(result.current.fileUploads[0].id, 'test.png')
      })

      expect(result.current.announcement?.events).toEqual([{ fileNames: ['test.png'], type: 'deleted' }])
      expect(result.current.announcement?.id).not.toBe(firstDeleteId)
    })
  })

  describe('selectionErrorFocusKey', () => {
    it('is not set when the selected files are valid', () => {
      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png')]))
      })

      expect(result.current.selectionErrorFocusKey).toBeUndefined()
    })

    it('changes every time choosing files results in a validation error', () => {
      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, inputRef: createInputRef(), maxFileSizeBytes: 5 }),
      )

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['123456'], 'too-large.png')]))
      })

      const firstKey = result.current.selectionErrorFocusKey

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['1234567'], 'also-too-large.png')]))
      })

      expect(firstKey).toBeDefined()
      expect(result.current.selectionErrorFocusKey).not.toBe(firstKey)
    })

    it('is cleared when an upload is removed', () => {
      const { result } = renderHook(() =>
        useFileUploads({ ...defaultParams, inputRef: createInputRef(), maxFileSizeBytes: 5 }),
      )

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['123456'], 'too-large.png')]))
      })

      act(() => {
        result.current.handleDelete(result.current.fileUploads[0].id, 'too-large.png')
      })

      expect(result.current.selectionErrorFocusKey).toBeUndefined()
    })

    it('does not change when an upload fails on the server', () => {
      let onError = () => {}

      ;(startUpload as Mock).mockImplementationOnce((_upload, _setFileUploads, callbacks: { onError: () => void }) => {
        onError = callbacks.onError
      })

      const { result } = renderHook(() => useFileUploads({ ...defaultParams, inputRef: createInputRef() }))

      act(() => {
        result.current.handleUpload(createChangeEvent([new File(['a'], 'a.png')]))
      })

      act(() => {
        onError()
      })

      expect(result.current.selectionErrorFocusKey).toBeUndefined()
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
