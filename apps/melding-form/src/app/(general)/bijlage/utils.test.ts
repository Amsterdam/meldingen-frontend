import { Mock } from 'vitest'

import { startUpload, UploadFile } from './utils'

describe('startUpload', () => {
  let mockSetFiles: Mock
  let mockXhr: any
  let uploadFile: UploadFile

  beforeEach(() => {
    mockSetFiles = vi.fn()
    mockXhr = {
      upload: {},
      send: vi.fn(),
      response: JSON.stringify({ id: 42, detail: 'fail' }),
      status: 200,
      onload: undefined,
      onerror: undefined,
    }
    uploadFile = {
      file: new File(['content'], 'test.txt'),
      id: 'abc',
      progress: 0,
      status: 'pending',
      xhr: mockXhr as any,
    }
  })

  it("sets status to 'uploading' and sends file", () => {
    startUpload(mockXhr, uploadFile, mockSetFiles)

    expect(mockSetFiles).toHaveBeenCalled()

    const mockFormData = new FormData()
    mockFormData.append('file', uploadFile.file)

    expect(mockXhr.send).toHaveBeenCalledWith(mockFormData)
  })

  // it('updates progress on upload progress event', () => {
  //   startUpload(mockXhr, uploadFile, mockSetFiles)

  //   const event = { lengthComputable: true, loaded: 50, total: 100 }

  //   mockXhr.upload.onprogress(event)

  //   expect(mockSetFiles).toHaveBeenCalledWith((prev) =>
  //     prev.map((file) =>
  //       file.id === uploadFile.id ? { ...file, progress: (event.loaded / event.total) * 100 } : file,
  //     ),
  //   )
  // })

  // it("sets status to 'success' on load with 200", () => {
  //   mockXhr.status = 200

  //   startUpload(mockXhr, uploadFile, mockSetFiles)

  //   mockXhr.onload()

  //   expect(mockSetFiles).toHaveBeenCalledWith(expect.any(Function))
  // })

  // it("sets status to 'error' on load with non-200", () => {
  //   mockXhr.status = 500
  //   startUpload(mockXhr, uploadFile, mockSetFiles)
  //   mockXhr.onload()
  //   expect(mockSetFiles).toHaveBeenCalledWith(expect.any(Function))
  // })

  // it("sets status to 'error' on error event", () => {
  //   startUpload(mockXhr, uploadFile, mockSetFiles)
  //   mockXhr.onerror()
  //   expect(mockSetFiles).toHaveBeenCalledWith(expect.any(Function))
  // })
})
