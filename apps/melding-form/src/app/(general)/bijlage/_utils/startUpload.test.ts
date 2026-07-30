import type { PendingFileUpload } from './startUpload'

import { startUpload } from './startUpload'

const xhrMock = {
  response: JSON.stringify({ id: 123 }),
  send: vi.fn(),
  status: 200,
  upload: {} as XMLHttpRequestUpload,
} as unknown as XMLHttpRequest

const fileUpload: PendingFileUpload = {
  file: new File(['content'], 'test.txt'),
  id: 'abc',
  progress: 0,
  status: 'pending',
  xhr: xhrMock,
}

const otherFileUpload: PendingFileUpload = {
  ...fileUpload,
  id: 'other',
}

const setFileUploadsMock = vi.fn()

describe('startUpload', () => {
  it("sets status to 'success' and updates serverId on 200", () => {
    startUpload(fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])
    const formData = (xhrMock.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as FormData

    expect(formData.get('file')).toBe(fileUpload.file)
    expect(result[0].status).toBe('success')
    expect(result[0].serverId).toBe(123)
  })

  it("sets status to 'error' on load with non-200", () => {
    const xhrMock = {
      response: JSON.stringify({ detail: 'Allowed content size exceeded' }),
      send: vi.fn(),
      status: 500,
      upload: {} as XMLHttpRequestUpload,
    } as unknown as XMLHttpRequest

    const failingFileUpload: PendingFileUpload = { ...fileUpload, xhr: xhrMock }

    startUpload(failingFileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].errorMessage).toBe('validation-errors.file-too-large')
  })

  it("sets status to 'error' with fallback error message when detail is missing", () => {
    const xhrMock = {
      response: JSON.stringify({}),
      send: vi.fn(),
      status: 500,
      upload: {} as XMLHttpRequestUpload,
    } as unknown as XMLHttpRequest

    const failingFileUpload: PendingFileUpload = { ...fileUpload, xhr: xhrMock }

    startUpload(failingFileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].errorMessage).toBe('validation-errors.failed-upload')
  })

  it('sets status to uploading when upload starts', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(fileUpload, setFileUploadsMock)

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[0][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('uploading')
  })

  it('updates progress on upload progress event', () => {
    startUpload(fileUpload, setFileUploadsMock)

    const event = { lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent<EventTarget>

    // Simulate onprogress event
    if (xhrMock.upload.onprogress) {
      xhrMock.upload.onprogress.call(xhrMock, event)
    }

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].progress).toBe(50)
  })

  it('does not update progress when the event is not length computable', () => {
    startUpload(fileUpload, setFileUploadsMock)

    const event = { lengthComputable: false, loaded: 50, total: 100 } as ProgressEvent<EventTarget>

    // Simulate onprogress event
    if (xhrMock.upload.onprogress) {
      xhrMock.upload.onprogress.call(xhrMock, event)
    }

    // Only the initial 'uploading' status update should have been triggered
    expect(setFileUploadsMock).toHaveBeenCalledTimes(1)
  })

  it("sets status to 'error' on network error", () => {
    startUpload(fileUpload, setFileUploadsMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].errorMessage).toBe('validation-errors.failed-upload')
  })

  it('returns the original file object if id does not match on load', () => {
    startUpload(fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })

  it('returns the original file object if id does not match on progress', () => {
    startUpload(fileUpload, setFileUploadsMock)

    const event = { lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent<EventTarget>

    // Simulate onprogress event
    if (xhrMock.upload.onprogress) {
      xhrMock.upload.onprogress.call(xhrMock, event)
    }

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])
    expect(result[0]).toBe(otherFileUpload)
  })

  it('returns the original file object if id does not match on error', () => {
    startUpload(fileUpload, setFileUploadsMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })

  it('returns the original file object if id does not match on upload start', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(fileUpload, setFileUploadsMock)

    const updater = setFileUploadsMock.mock.calls[0][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })
})
