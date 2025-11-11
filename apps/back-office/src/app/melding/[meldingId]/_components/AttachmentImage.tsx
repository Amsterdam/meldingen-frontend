'use client'

import { Image, Paragraph } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

type Props = {
  blob: Blob | null
  fileName: string
}

export const AttachmentImage = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  // This useEffect is necessary to avoid render problems while refreshing the page.
  useEffect(() => {
    if (blob) setUrl(URL.createObjectURL(blob))

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  if (!blob) return <Paragraph>{fileName}</Paragraph>

  return url && <Image src={url} alt="" />
}
