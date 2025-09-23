import { Dispatch, SetStateAction } from 'react'

export type UploadFile = {
  error?: string
  file: File
  id: string
  progress: number // 0-100
  serverId?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  xhr: XMLHttpRequest
}

// We're using XMLHttpRequest instead of fetch here,
// because fetch does not allow you to track the upload progress.
export const startUpload = (
  xhr: XMLHttpRequest,
  uploadFile: UploadFile,
  setFiles: Dispatch<SetStateAction<UploadFile[]>>,
) => {
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === uploadFile.id ? { ...file, progress: (event.loaded / event.total) * 100 } : file,
        ),
      )
    }
  }

  xhr.onload = () => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === uploadFile.id
          ? {
              ...file,
              serverId: JSON.parse(xhr.response).id,
              status: xhr.status === 200 ? 'success' : 'error',
              error: xhr.status !== 200 ? JSON.parse(xhr.response).detail : undefined,
            }
          : file,
      ),
    )
  }

  xhr.onerror = () => {
    setFiles((prev) =>
      prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'error', error: 'Network error' } : file)),
    )
  }

  setFiles((prev) => prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'uploading' } : file)))

  const formData = new FormData()
  formData.append('file', uploadFile.file)
  xhr.send(formData)
}
