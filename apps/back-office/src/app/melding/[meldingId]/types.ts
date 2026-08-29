export type MeldingAttachment = {
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

export type AttachmentFile = {
  blob: Blob | null
}

export type MeldingAttachmentWithFile = AttachmentFile & MeldingAttachment
