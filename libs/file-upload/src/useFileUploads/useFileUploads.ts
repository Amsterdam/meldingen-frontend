import type { ChangeEvent, Dispatch, RefObject, SetStateAction, SubmitEvent } from 'react'

import { useRef, useState } from 'react'

import type { UploadResult } from './startServerActionUpload'
import type { ErroredFileUpload, FileUploadState, FileUpload as FileUploadType, PendingFileUpload } from './startUpload'

import { startServerActionUpload } from './startServerActionUpload'
import { startUpload } from './startUpload'

export type ExistingFile = {
  blob?: Blob
  fileName: string
  serverId: number
}

type GenericErrorMessage = {
  description?: string
  options?: Record<string, string | number>
  title: string
}

const createDuplicatedUploadError = (file: File, errorMessage: string, id: string): ErroredFileUpload => ({
  errorMessage,
  file,
  id,
  progress: 0,
  status: 'error',
})

const createFileUpload = (file: File, id: string): PendingFileUpload => ({
  file,
  id,
  progress: 0,
  status: 'pending',
  xhr: new XMLHttpRequest(),
})

const mapExistingFilesToUploads = (files: ExistingFile[], idPrefix: string): FileUploadType[] =>
  files.map(({ blob, fileName, serverId }, index) => ({
    file: blob ? new File([blob], fileName) : { name: fileName },
    id: `${idPrefix}-${index + 1}`,
    progress: 100,
    serverId,
    status: 'success',
  }))

const isPendingUpload = (upload: FileUploadState): upload is PendingFileUpload => upload.status === 'pending'

const startPendingUploads = (
  uploads: FileUploadState[],
  uploadUrl: string,
  setFileUploads: Dispatch<SetStateAction<FileUploadState[]>>,
) => {
  uploads.filter(isPendingUpload).forEach((upload) => {
    upload.xhr.open('POST', uploadUrl)
    startUpload(upload, setFileUploads)
  })
}

const startPendingServerActionUpload = (
  uploads: FileUploadState[],
  uploadFile: (file: File) => Promise<UploadResult>,
  setFileUploads: Dispatch<SetStateAction<FileUploadState[]>>,
) => {
  uploads.filter(isPendingUpload).forEach((upload) => {
    startServerActionUpload(upload, uploadFile, setFileUploads)
  })
}

type BaseUseFileUploadsParams = {
  /**
   * Function to delete the attachment on the server.
   * Authentication (token query param, cookies, etc.) is handled by the caller.
   */
  deleteAttachment: (serverId: number) => Promise<{ error: unknown }>
  existingFiles: ExistingFile[]
  idPrefix: string
  inputRef: RefObject<HTMLInputElement | null>
  maxSuccessfulUploads: number
  maxUploadAttempts: number
}

type UseFileUploadsParams = BaseUseFileUploadsParams &
  (
    | {
        /**
         * Uploads a file via a server-side action (e.g. a Next.js Server Action).
         * Authentication is handled entirely server-side; no upload progress or cancellation is available.
         */
        uploadFile: (file: File) => Promise<UploadResult>
        uploadUrl?: never
      }
    | {
        uploadFile?: never
        /**
         * Full URL to POST the upload to.
         * Authentication (token query param, cookies, etc.) is handled by the caller.
         */
        uploadUrl: string
      }
  )

export const useFileUploads = ({
  deleteAttachment,
  existingFiles,
  idPrefix,
  inputRef,
  maxSuccessfulUploads,
  maxUploadAttempts,
  uploadFile,
  uploadUrl,
}: UseFileUploadsParams) => {
  // NOTE: Current flows separate client-side and server-side authentication
  // Whereas the client-side uses uploadUrl (url token auth), enabling xhr and onprogress tracking
  // server-side authentication is handled on the server, thus not supporting specific features
  const supportsUploadCancellation = Boolean(uploadUrl)

  const uploadIdCounter = useRef(existingFiles.length)

  const existingFileUploads = mapExistingFilesToUploads(existingFiles, idPrefix)

  const [fileUploads, setFileUploads] = useState<FileUploadState[]>(existingFileUploads)
  const [genericError, setGenericError] = useState<GenericErrorMessage>()
  const [deletedFileName, setDeletedFileName] = useState<string>()

  const getNextUploadId = () => {
    uploadIdCounter.current += 1
    return `${idPrefix}-${uploadIdCounter.current}`
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setGenericError(undefined)

    if (!event.currentTarget.files) return

    const newFiles = Array.from(event.currentTarget.files)

    if (newFiles.length + fileUploads.length > maxUploadAttempts) {
      setGenericError({
        description: 'errors.too-many-attempts.description',
        title: 'errors.too-many-attempts.title',
      })
      return
    }

    const successfulUploadsCount = fileUploads.filter((file) => file.status !== 'error').length

    if (newFiles.length + successfulUploadsCount > maxSuccessfulUploads) {
      setGenericError({
        options: { maxFiles: maxSuccessfulUploads },
        title: 'errors.too-many-files.title',
      })
      return
    }

    const newFileUploads = newFiles.map((newFile) => {
      if (fileUploads.find((upload) => upload.file.name === newFile.name)) {
        return createDuplicatedUploadError(newFile, 'validation-errors.duplicate-upload', getNextUploadId())
      }

      return createFileUpload(newFile, getNextUploadId())
    })

    setFileUploads((prev) => [...prev, ...newFileUploads])

    // Clear the file input after starting the upload, so it is empty for the next selection.
    // Non-null assertion is safe: handleUpload only runs as this input's own change handler,
    // so the input (and inputRef.current) must already exist when it fires.
    inputRef.current!.value = ''

    if (supportsUploadCancellation) {
      startPendingUploads(newFileUploads, uploadUrl!, setFileUploads)
      return
    }

    startPendingServerActionUpload(newFileUploads, uploadFile!, setFileUploads)
  }

  const removeLocalUpload = (id: string, fileName: string) => {
    setFileUploads((prev) => prev.filter((upload) => upload.id !== id))
    setDeletedFileName(fileName)
  }

  const abortInProgressUpload = (id: string, fileName: string, xhr: XMLHttpRequest) => {
    xhr.abort()
    removeLocalUpload(id, fileName)
  }

  const deleteUploadFromServer = async (id: string, serverId: number, fileName: string) => {
    const { error } = await deleteAttachment(serverId)

    if (error) {
      setGenericError({
        description: 'errors.delete-failed.description',
        title: 'errors.delete-failed.title',
      })
      return
    }

    removeLocalUpload(id, fileName)
  }

  const handleDelete = async (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => {
    setGenericError(undefined)

    if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
      abortInProgressUpload(id, fileName, xhr)
      return
    }

    // If the file upload does not have a server id (because the server returned an error for example)
    // simply remove it from the list
    if (!serverId) {
      removeLocalUpload(id, fileName)
      return
    }

    await deleteUploadFromServer(id, serverId, fileName)
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    if (fileUploads.some((u) => u.status === 'uploading')) {
      e.preventDefault()
      setGenericError({
        description: 'errors.upload-in-progress.description',
        title: 'errors.upload-in-progress.title',
      })
    }
  }

  return {
    deletedFileName,
    fileUploads,
    genericError,
    handleDelete,
    handleSubmit,
    handleUpload,
    supportsUploadCancellation,
  }
}
