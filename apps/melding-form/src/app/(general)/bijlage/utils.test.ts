import type { PendingFileUpload } from './utils'

import { safeJSONParse, startUpload } from './utils'

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

describe('safeJSONParse', () => {
  it('returns undefined for undefined input', () => {
    expect(safeJSONParse()).toBeUndefined()
  })

  it('returns undefined for invalid JSON', () => {
    expect(safeJSONParse('invalid')).toBeUndefined()
  })

  it('parses valid JSON', () => {
    expect(safeJSONParse('{"key":"value"}')).toEqual({ key: 'value' })
  })
})

describe('startUpload', () => {
  it("sets status to 'success' and updates serverId on 200", () => {
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
    const xhrMock = {
      response: JSON.stringify({ detail: 'Test error' }),
      send: vi.fn(),
      status: 500,
      upload: {} as XMLHttpRequestUpload,
    } as unknown as XMLHttpRequest

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].errorMessage).toBe('Test error')
  })

  it('sets status to uploading when upload starts', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[0][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('uploading')
  })

  it('updates progress on upload progress event', () => {
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
    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    expect(setFileUploadsMock).toHaveBeenCalled()

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([fileUpload])

    expect(result[0].status).toBe('error')
    expect(result[0].errorMessage).toBe('Network error')
  })

  it('returns the original file object if id does not match on load', () => {
    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onload event
    xhrMock.onload?.(new ProgressEvent('load'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })

  it('returns the original file object if id does not match on progress', () => {
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
    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    // Simulate onerror event
    xhrMock.onerror?.(new ProgressEvent('error'))

    const updater = setFileUploadsMock.mock.calls[1][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })

  it('returns the original file object if id does not match on upload start', () => {
    const setFileUploadsMock = vi.fn()

    startUpload(xhrMock, fileUpload, setFileUploadsMock)

    const updater = setFileUploadsMock.mock.calls[0][0]
    const result = updater([otherFileUpload])

    expect(result[0]).toBe(otherFileUpload)
  })
})
