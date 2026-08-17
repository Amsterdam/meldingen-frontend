import type { Dispatch, SetStateAction } from 'react'

const safeJSONParse = <T>(value: unknown): T | undefined => {
  if (!value || typeof value !== 'string') return undefined

  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export type FileUpload = {
  errorMessage?: string
  file: File | { name: string }
  id: string
  progress: number // 0-100
  serverId?: number
  status: 'uploading' | 'success'
  xhr?: XMLHttpRequest
}

export type ErroredFileUpload = Omit<FileUpload, 'status'> & {
  errorMessage: string
  status: 'error'
}

export type PendingFileUpload = Omit<FileUpload, 'status'> & {
  file: File
  status: 'pending'
  xhr: XMLHttpRequest
}

export type FileUploadState = FileUpload | ErroredFileUpload | PendingFileUpload

export const VALIDATION_ERROR_MESSAGES_TRANSLATION_KEYS: Record<string, string> = {
  'Allowed content size exceeded': 'validation-errors.file-too-large',
  'Attachment not allowed': 'validation-errors.invalid-file-type',
  'Media type of data does not match provided media type': 'validation-errors.invalid-file-extension',
}

export const getValidationErrorMessageTranslationKey = (error?: string): string =>
  (error && VALIDATION_ERROR_MESSAGES_TRANSLATION_KEYS[error]) || 'validation-errors.failed-upload'

// We're using XMLHttpRequest instead of fetch here,
// because fetch does not allow you to track the upload progress.
export const startUpload = (
  fileUpload: PendingFileUpload,
  setFileUploads: Dispatch<SetStateAction<FileUploadState[]>>,
) => {
  const xhr = fileUpload.xhr

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      setFileUploads((prev) =>
        prev.map((upload): FileUploadState =>
          upload.id === fileUpload.id ? { ...upload, progress: (event.loaded / event.total) * 100 } : upload,
        ),
      )
    }
  }

  xhr.onload = () => {
    type Response = { detail?: string; id?: number }

    const parsed = safeJSONParse<Response>(xhr.response)
    const isOk = xhr.status >= 200 && xhr.status < 300

    setFileUploads((prev) =>
      prev.map((upload): FileUploadState => {
        if (upload.id !== fileUpload.id) return upload

        if (!isOk) {
          return {
            ...upload,
            errorMessage: getValidationErrorMessageTranslationKey(parsed?.detail),
            serverId: parsed?.id,
            status: 'error',
          }
        }

        return { ...upload, errorMessage: undefined, serverId: parsed?.id, status: 'success' }
      }),
    )
  }

  xhr.onerror = () => {
    setFileUploads((prev) =>
      prev.map((upload): FileUploadState => {
        const isCurrentUpload = upload.id === fileUpload.id

        if (!isCurrentUpload) return upload

        return {
          ...upload,
          errorMessage: 'validation-errors.failed-upload',
          status: 'error',
        }
      }),
    )
  }

  setFileUploads((prev) =>
    prev.map((upload): FileUploadState => {
      const isNewUpload = upload.id === fileUpload.id

      if (!isNewUpload) return upload

      return { ...upload, errorMessage: undefined, status: 'uploading' }
    }),
  )

  const formData = new FormData()

  formData.append('file', fileUpload.file)

  xhr.send(formData)
}
