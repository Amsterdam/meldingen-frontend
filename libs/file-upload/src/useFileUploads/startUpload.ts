import type { Dispatch, SetStateAction } from 'react'

import type { FileUploadState, PendingFileUpload } from './types'

import { getValidationErrorMessageTranslationKey } from './utils'

const safeJSONParse = <T>(value: unknown): T | undefined => {
  if (!value || typeof value !== 'string') return undefined

  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

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
