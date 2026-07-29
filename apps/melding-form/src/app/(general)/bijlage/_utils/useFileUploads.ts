import type { ChangeEvent, Dispatch, RefObject, SetStateAction, SubmitEvent } from 'react'

import { useRef, useState } from 'react'

import type { ExistingFileType } from '../page'
import type { FileUploadState, FileUpload as FileUploadType, PendingFileUpload } from './startUpload'

import { startUpload } from './startUpload'

type GenericErrorMessage = {
  description?: string
  options?: Record<string, string | number>
  title: string
}

const createDuplicatedUploadError = (file: File, errorMessage: string, id: string): FileUploadType => ({
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

const mapExistingFilesToUploads = (files: ExistingFileType[], idPrefix: string): FileUploadType[] =>
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

type UseFileUploadsParams = {
  // Deletes the attachment on the server; how it authenticates (token query param, cookies, ...)
  // is entirely up to the caller.
  deleteAttachment: (serverId: number) => Promise<{ error: unknown }>
  existingFiles: ExistingFileType[]
  idPrefix: string
  inputRef: RefObject<HTMLInputElement | null>
  maxSuccessfulUploads: number
  maxUploadAttempts: number
  // Full URL to POST the upload to, built by the caller (e.g. including a token query param,
  // or a same-origin path that relies on cookies).
  uploadUrl: string
}

export const useFileUploads = ({
  deleteAttachment,
  existingFiles,
  idPrefix,
  inputRef,
  maxSuccessfulUploads,
  maxUploadAttempts,
  uploadUrl,
}: UseFileUploadsParams) => {
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

    if (newFiles.length + fileUploads.filter((file) => file.status !== 'error').length > maxSuccessfulUploads) {
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
    startPendingUploads(newFileUploads, uploadUrl, setFileUploads)

    // Clear the file input after starting the upload, so it is empty for the next selection.
    // Non-null assertion is safe here because handleUpload is only called when the input and Attachments are mounted
    inputRef.current!.value = ''
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

      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error)
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

  return { deletedFileName, fileUploads, genericError, handleDelete, handleSubmit, handleUpload }
}
