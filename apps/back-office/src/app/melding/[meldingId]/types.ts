export type DescriptionListItem = {
  description: string
  key: string
  term: string
}

type File = {
  blob: Blob | null
  createdAt: string
  error?: string
  fileName: string
  id: number
}

export type Attachments = Omit<DescriptionListItem, 'description'> & { files: File[] }
