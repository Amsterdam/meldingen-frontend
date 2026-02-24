import { Dispatch, SetStateAction } from 'react'

export const safeJSONParse = (jsonString?: string) => {
  if (!jsonString) return undefined

  try {
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}

const VALIDATION_ERROR_MESSAGES: Record<string, string> = {
  'Allowed content size exceeded': 'validation-errors.file-too-large',
  'Attachment not allowed': 'validation-errors.invalid-file-type',
  'Media type of data does not match provided media type': 'validation-errors.invalid-file-extension',
}

const getValidationErrorMessage = (error: string | undefined, t: (key: string) => string): string =>
  t((error && VALIDATION_ERROR_MESSAGES[error]) || 'validation-errors.failed-upload')

export type FileUpload = {
  errorMessage?: string
  file: File | { name: string }
  id: string
  progress: number // 0-100
  serverId?: number
  status: 'uploading' | 'success' | 'error'
  xhr?: XMLHttpRequest
}

export type PendingFileUpload = Omit<FileUpload, 'status'> & {
  status: 'pending'
  xhr: XMLHttpRequest
}

// We're using XMLHttpRequest instead of fetch here,
// because fetch does not allow you to track the upload progress.
export const startUpload = (
  xhr: XMLHttpRequest,
  fileUpload: PendingFileUpload,
  setFileUploads: Dispatch<SetStateAction<(FileUpload | PendingFileUpload)[]>>,
  t: (key: string) => string,
) => {
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      setFileUploads((prev) =>
        prev.map((upload): FileUpload | PendingFileUpload =>
          upload.id === fileUpload.id ? { ...upload, progress: (event.loaded / event.total) * 100 } : upload,
        ),
      )
    }
  }

  xhr.onload = () => {
    setFileUploads((prev) =>
      prev.map((upload): FileUpload | PendingFileUpload =>
        upload.id === fileUpload.id
          ? {
              ...upload,
              errorMessage:
                xhr.status !== 200 ? getValidationErrorMessage(safeJSONParse(xhr.response)?.detail, t) : undefined,
              serverId: safeJSONParse(xhr.response)?.id,
              status: xhr.status !== 200 ? 'error' : 'success',
            }
          : upload,
      ),
    )
  }

  xhr.onerror = () => {
    setFileUploads((prev) =>
      prev.map((upload): FileUpload | PendingFileUpload =>
        upload.id === fileUpload.id
          ? {
              ...upload,
              errorMessage: getValidationErrorMessage(safeJSONParse(xhr.response)?.detail, t),
              status: 'error',
            }
          : upload,
      ),
    )
  }

  setFileUploads((prev) =>
    prev.map((upload): FileUpload | PendingFileUpload =>
      upload.id === fileUpload.id ? { ...upload, status: 'uploading' } : upload,
    ),
  )

  const formData = new FormData()

  if (fileUpload.file instanceof File) {
    formData.append('file', fileUpload.file)
  }

  xhr.send(formData)
}
