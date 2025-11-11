import { Dispatch, SetStateAction } from 'react'

export const safeJSONParse = (jsonString?: string) => {
  if (!jsonString) return undefined

  try {
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}

export type FileUpload = {
  error?: string
  file: File
  id: string
  progress: number // 0-100
  serverId?: number
  status: 'uploading' | 'success' | 'error'
  xhr?: XMLHttpRequest
}

export type PendingFileUpload = Omit<FileUpload, 'status'> & {
  xhr: XMLHttpRequest
  status: 'pending'
}

// We're using XMLHttpRequest instead of fetch here,
// because fetch does not allow you to track the upload progress.
export const startUpload = (
  xhr: XMLHttpRequest,
  fileUpload: PendingFileUpload,
  setFileUploads: Dispatch<SetStateAction<(FileUpload | PendingFileUpload)[]>>,
) => {
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      setFileUploads((prev) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, progress: (event.loaded / event.total) * 100 } : upload,
        ),
      )
    }
  }

  xhr.onload = () => {
    setFileUploads((prev) =>
      prev.map((upload) =>
        upload.id === fileUpload.id
          ? {
              ...upload,
              serverId: safeJSONParse(xhr.response)?.id,
              status: xhr.status === 200 ? 'success' : 'error',
              error: xhr.status !== 200 ? safeJSONParse(xhr.response)?.detail : undefined,
            }
          : upload,
      ),
    )
  }

  xhr.onerror = () => {
    setFileUploads((prev) =>
      prev.map((upload) =>
        upload.id === fileUpload.id ? { ...upload, status: 'error', error: 'Network error' } : upload,
      ),
    )
  }

  setFileUploads((prev) =>
    prev.map((upload) => (upload.id === fileUpload.id ? { ...upload, status: 'uploading' } : upload)),
  )

  const formData = new FormData()
  formData.append('file', fileUpload.file)
  xhr.send(formData)
}
