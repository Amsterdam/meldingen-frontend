import type { ChangeEvent, Dispatch, RefObject, SetStateAction, SubmitEvent } from 'react'

import { useEffect, useRef, useState } from 'react'

import type {
  Announcement,
  AnnouncementType,
  ErroredFileUpload,
  ExistingFile,
  FileUploadState,
  FileUpload as FileUploadType,
  PendingFileUpload,
} from './types'

import { startUpload } from './startUpload'

type GenericErrorMessage = {
  description?: string
  options?: Record<string, string | number>
  title: string
}

const createErroredUpload = (file: File, errorMessage: string, id: string): ErroredFileUpload => ({
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
  uploads: PendingFileUpload[],
  uploadUrl: string,
  setFileUploads: Dispatch<SetStateAction<FileUploadState[]>>,
  onUploadSuccess: (fileName: string) => void,
) => {
  uploads.forEach((upload) => {
    upload.xhr.open('POST', uploadUrl)
    startUpload(upload, setFileUploads, () => onUploadSuccess(upload.file.name))
  })
}

// Uploads that finish within this time of each other are announced as one message,
// because a new message in the same status region would interrupt the previous one.
export const SUCCESS_ANNOUNCEMENT_GROUPING_MS = 300

type UseFileUploadsParams = {
  /**
   * Function to delete the attachment on the server.
   * Authentication (token query param, cookies, etc.) is handled by the caller.
   */
  deleteAttachment: (serverId: number) => Promise<{ error: unknown }>
  existingFiles: ExistingFile[]
  idPrefix: string
  inputRef: RefObject<HTMLInputElement | null>
  maxFileSizeBytes?: number
  maxSuccessfulUploads: number
  maxUploadAttempts: number
  uploadUrl: string
}

export const useFileUploads = ({
  deleteAttachment,
  existingFiles,
  idPrefix,
  inputRef,
  maxFileSizeBytes,
  maxSuccessfulUploads,
  maxUploadAttempts,
  uploadUrl,
}: UseFileUploadsParams) => {
  const uploadIdCounter = useRef(existingFiles.length)

  const existingFileUploads = mapExistingFilesToUploads(existingFiles, idPrefix)

  const [fileUploads, setFileUploads] = useState<FileUploadState[]>(existingFileUploads)
  const [genericError, setGenericError] = useState<GenericErrorMessage>()
  const [announcement, setAnnouncement] = useState<Announcement>()

  const announcementIdCounter = useRef(0)
  const succeededFileNames = useRef<string[]>([])
  const successAnnouncementTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(successAnnouncementTimeout.current), [])

  const announce = (type: AnnouncementType, fileNames: string[]) => {
    announcementIdCounter.current += 1
    setAnnouncement({ fileNames, id: announcementIdCounter.current, type })
  }

  const handleUploadSuccess = (fileName: string) => {
    succeededFileNames.current.push(fileName)

    clearTimeout(successAnnouncementTimeout.current)
    successAnnouncementTimeout.current = setTimeout(() => {
      announce('upload-succeeded', succeededFileNames.current)
      succeededFileNames.current = []
    }, SUCCESS_ANNOUNCEMENT_GROUPING_MS)
  }

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
      if (fileUploads.some((upload) => upload.file.name === newFile.name)) {
        return createErroredUpload(newFile, 'validation-errors.duplicate-upload', getNextUploadId())
      }

      // The server rejects files that are too large as well, but checking here first means the user
      // gets the error straight away, instead of only after the whole file has been sent.
      if (maxFileSizeBytes && newFile.size > maxFileSizeBytes) {
        return createErroredUpload(newFile, 'validation-errors.file-too-large', getNextUploadId())
      }

      return createFileUpload(newFile, getNextUploadId())
    })

    setFileUploads((prev) => [...prev, ...newFileUploads])

    // Clear the file input after starting the upload, so it is empty for the next selection.
    // Non-null assertion is safe: handleUpload only runs as this input's own change handler,
    // so the input (and inputRef.current) must already exist when it fires.
    inputRef.current!.value = ''

    const pendingUploads = newFileUploads.filter(isPendingUpload)

    if (pendingUploads.length > 0) {
      announce(
        'upload-started',
        pendingUploads.map((upload) => upload.file.name),
      )
    }

    startPendingUploads(pendingUploads, uploadUrl, setFileUploads, handleUploadSuccess)
  }

  const removeLocalUpload = (id: string, fileName: string, announcementType: AnnouncementType = 'deleted') => {
    setFileUploads((prev) => prev.filter((upload) => upload.id !== id))
    announce(announcementType, [fileName])
  }

  const abortInProgressUpload = (id: string, fileName: string, xhr: XMLHttpRequest) => {
    xhr.abort()
    removeLocalUpload(id, fileName, 'cancelled')
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
    announcement,
    fileUploads,
    genericError,
    handleDelete,
    handleSubmit,
    handleUpload,
  }
}
