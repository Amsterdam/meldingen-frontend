import type { Dispatch, SetStateAction } from 'react'

import type { FileUploadState, PendingFileUpload, UploadResult } from './types'

import { getValidationErrorMessageTranslationKey } from './utils'

// Server Actions can't report byte-level progress or be aborted, so uploads jump straight from 0% to 100%.
export const startServerActionUpload = async (
  fileUpload: PendingFileUpload,
  uploadFile: (file: File) => Promise<UploadResult>,
  setFileUploads: Dispatch<SetStateAction<FileUploadState[]>>,
) => {
  setFileUploads((prev) =>
    prev.map((upload): FileUploadState => {
      const isNewUpload = upload.id === fileUpload.id

      if (!isNewUpload) return upload

      return { ...upload, errorMessage: undefined, status: 'uploading' }
    }),
  )

  const { error, serverId } = await uploadFile(fileUpload.file)

  setFileUploads((prev) =>
    prev.map((upload): FileUploadState => {
      const isCurrentUpload = upload.id !== fileUpload.id

      if (isCurrentUpload) return upload

      if (error) {
        return { ...upload, errorMessage: getValidationErrorMessageTranslationKey(error), serverId, status: 'error' }
      }

      return { ...upload, errorMessage: undefined, progress: 100, serverId, status: 'success' }
    }),
  )
}
