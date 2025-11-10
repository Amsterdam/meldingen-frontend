import { Image, Paragraph } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

type Props = {
  blob: Blob
  fileName: string
}

export const AttachmentImage = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    setUrl(URL.createObjectURL(blob))

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  return (
    url && (
      <>
        <Image src={url} alt="" className="ams-mb-m" />
        <Paragraph>{fileName}</Paragraph>
      </>
    )
  )
}
