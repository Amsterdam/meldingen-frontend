import { startUpload, UploadFile } from './utils'

const createXhrMock = ({
  status = 200,
  response = '{}',
  upload = {} as XMLHttpRequestUpload,
  send = vi.fn(),
} = {}): Partial<XMLHttpRequest> => ({
  status,
  response,
  upload,
  send,
  onload: null,
  onerror: null,
})

const uploadFile: UploadFile = {
  file: new File(['content'], 'test.txt'),
  id: 'abc',
  progress: 0,
  status: 'pending',
  xhr: createXhrMock() as XMLHttpRequest,
}

const otherFile: UploadFile = {
  ...uploadFile,
  id: 'other',
}

describe('startUpload', () => {
  it("sets status to 'success' and updates serverId on 200", () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock({ response: JSON.stringify({ id: 123 }) }) as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFilesMock).toHaveBeenCalled()

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([uploadFile])

    expect(result[0].status).toBe('success')
    expect(result[0].serverId).toBe(123)
  })

  it("sets status to 'error' on load with non-200", () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock({ status: 500, response: JSON.stringify({ detail: 'Test error' }) }) as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFilesMock).toHaveBeenCalled()

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([uploadFile])

    expect(result[0].status).toBe('error')
    expect(result[0].error).toBe('Test error')
  })

  it('updates progress on upload progress event', () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock() as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    const event = { lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent<EventTarget>

    // Simulate onprogress event
    if (xhrMock.upload.onprogress) {
      xhrMock.upload.onprogress.call(xhrMock, event)
    }

    expect(setFilesMock).toHaveBeenCalled()

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([uploadFile])

    expect(result[0].progress).toBe(50)
  })

  it("sets status to 'error' on network error", () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock() as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    expect(setFilesMock).toHaveBeenCalled()

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([uploadFile])

    expect(result[0].status).toBe('error')
    expect(result[0].error).toBe('Network error')
  })

  it('returns the original file object if id does not match on load', () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock() as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([otherFile])

    expect(result[0]).toBe(otherFile)
  })

  it('returns the original file object if id does not match on progress', () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock() as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    const event = { lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent<EventTarget>

    // Simulate onprogress event
    if (xhrMock.upload.onprogress) {
      xhrMock.upload.onprogress.call(xhrMock, event)
    }

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([otherFile])
    expect(result[0]).toBe(otherFile)
  })

  it('returns the original file object if id does not match on error', () => {
    const setFilesMock = vi.fn()
    const xhrMock = createXhrMock() as XMLHttpRequest

    startUpload(xhrMock, uploadFile, setFilesMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    const updater = setFilesMock.mock.calls[1][0]
    const result = updater([otherFile])

    expect(result[0]).toBe(otherFile)
  })
})
