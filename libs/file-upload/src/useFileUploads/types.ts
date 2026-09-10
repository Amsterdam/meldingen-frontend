export type ExistingFile = {
  blob?: Blob
  fileName: string
  serverId: number
}

export type UploadResult = {
  error?: string
  serverId?: number
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
