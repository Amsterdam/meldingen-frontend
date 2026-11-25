export type ExistingFile = {
  blob?: Blob
  fileName: string
  serverId: number
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

export type AnnouncementType = 'cancelled' | 'deleted' | 'upload-started' | 'upload-succeeded'

/**
 * A message for a screen-reader status region.
 * `id` increases with every announcement, so an identical message can be announced again.
 */
export type Announcement = {
  fileNames: string[]
  id: number
  type: AnnouncementType
}
