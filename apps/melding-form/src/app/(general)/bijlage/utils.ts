import { Dispatch, SetStateAction } from 'react'

export const safeJSONParse = (jsonString?: string) => {
  if (!jsonString) return undefined

  try {
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}

export const VALIDATION_ERROR_MESSAGES_TRANSLATION_KEYS: Record<string, string> = {
  'Allowed content size exceeded': 'validation-errors.file-too-large',
  'Attachment not allowed': 'validation-errors.invalid-file-type',
  'Media type of data does not match provided media type': 'validation-errors.invalid-file-extension',
}

export const getValidationErrorMessageTranslationKey = (error?: string): string =>
  (error && VALIDATION_ERROR_MESSAGES_TRANSLATION_KEYS[error]) || 'validation-errors.failed-upload'

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
                xhr.status !== 200
                  ? getValidationErrorMessageTranslationKey(safeJSONParse(xhr.response)?.detail)
                  : undefined,
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
              errorMessage: 'validation-errors.failed-upload',
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
