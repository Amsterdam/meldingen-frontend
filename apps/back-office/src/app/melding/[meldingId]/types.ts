type Attachment = {
  createdAt: string
  id: number
  originalFilename: string
  updatedAt: string
  user?: {
    email: string
    id: number
    username: string
  }
}

type File = {
  blob: Blob | null
}

export type MeldingAttachment = Attachment & File
