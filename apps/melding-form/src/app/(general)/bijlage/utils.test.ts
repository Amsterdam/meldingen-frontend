import { startUpload } from './utils'
import type { FileUpload } from './utils'

const xhrMock = {
  status: 200,
  response: JSON.stringify({ id: 123 }),
  upload: {} as XMLHttpRequestUpload,
  send: vi.fn(),
} as unknown as XMLHttpRequest

const fileUpload: FileUpload = {
  file: new File(['content'], 'test.txt'),
  id: 'abc',
  progress: 0,
  status: 'pending',
  xhr: xhrMock,
}

const otherFileUpload: FileUpload = {
  ...fileUpload,
  id: 'other',
}

describe('startUpload', () => {
  it("sets status to 'success' and updates serverId on 200", () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('success')
    expect(result[0].serverId).toBe(123)
  })

  it("sets status to 'error' on load with non-200", () => {
    const setFileUploadsMock = vi.fn()
    const xhrMock = {
      status: 500,
      response: JSON.stringify({ detail: 'Test error' }),
      upload: {} as XMLHttpRequestUpload,
      send: vi.fn(),
    } as unknown as XMLHttpRequest

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].error).toBe('Test error')
  })

  it('updates progress on upload progress event', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

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

  it("sets status to 'error' on network error", () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].error).toBe('Network error')
  })

  it('returns the original file object if id does not match on load', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })

  it('returns the original file object if id does not match on progress', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

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
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })
})
