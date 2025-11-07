'use client'

import { Image, Paragraph } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

type Props = {
  blob: Blob | null
  fileName: string
}

export const AttachmentImage = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (blob) setUrl(URL.createObjectURL(blob))

    if (!url) return undefined

    return () => URL.revokeObjectURL(url)
  }, [])

  if (!blob) return <Paragraph>{fileName}</Paragraph>

  return url && <Image src={url} alt="" />
}
