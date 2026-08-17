import type { PendingFileUpload } from './startUpload'

import { startServerActionUpload } from './startServerActionUpload'

const fileUpload: PendingFileUpload = {
  file: new File(['content'], 'test.txt'),
  id: 'abc',
  progress: 0,
  status: 'pending',
  xhr: {} as XMLHttpRequest,
}

const otherFileUpload: PendingFileUpload = {
  ...fileUpload,
  id: 'other',
}

describe('startServerActionUpload', () => {
  it("sets status to 'uploading' when the upload starts", async () => {
    const setFileUploadsMock = vi.fn()
    const uploadFileMock = vi.fn().mockResolvedValue({ serverId: 123 })

    await startServerActionUpload(fileUpload, uploadFileMock, setFileUploadsMock)

    const updater = setFileUploadsMock.mock.calls[0][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('uploading')
  })

  it("sets status to 'success' and updates progress and serverId when uploadFile resolves without an error", async () => {
    const setFileUploadsMock = vi.fn()
    const uploadFileMock = vi.fn().mockResolvedValue({ serverId: 123 })

    await startServerActionUpload(fileUpload, uploadFileMock, setFileUploadsMock)

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0]).toMatchObject({ progress: 100, serverId: 123, status: 'success' })
  })

  it("sets status to 'error' with a mapped translation key when uploadFile resolves with an error", async () => {
    const setFileUploadsMock = vi.fn()
    const uploadFileMock = vi.fn().mockResolvedValue({ error: 'Allowed content size exceeded' })

    await startServerActionUpload(fileUpload, uploadFileMock, setFileUploadsMock)

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0]).toMatchObject({ errorMessage: 'validation-errors.file-too-large', status: 'error' })
  })

  it('sets a fallback error message when the error is not recognized', async () => {
    const setFileUploadsMock = vi.fn()
    const uploadFileMock = vi.fn().mockResolvedValue({ error: 'Some unknown error' })

    await startServerActionUpload(fileUpload, uploadFileMock, setFileUploadsMock)

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0]).toMatchObject({ errorMessage: 'validation-errors.failed-upload', status: 'error' })
  })

  it('returns the original file object if id does not match', async () => {
    const setFileUploadsMock = vi.fn()
    const uploadFileMock = vi.fn().mockResolvedValue({ serverId: 123 })

    await startServerActionUpload(fileUpload, uploadFileMock, setFileUploadsMock)

    const uploadingUpdater = setFileUploadsMock.mock.calls[0][0]
    const successUpdater = setFileUploadsMock.mock.calls[1][0]

    expect(uploadingUpdater([otherFileUpload])[0]).toBe(otherFileUpload)
    expect(successUpdater([otherFileUpload])[0]).toBe(otherFileUpload)
  })
})
