import { Image, Paragraph } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

import styles from './AttachmentImage.module.css'

type Props = {
  blob: Blob
  fileName: string
}

const Placeholder = () => <div className={styles.loading} />

export const AttachmentImage = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob)

    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

  return (
    <>
      {url ? <Image alt="" className={styles.image} src={url} /> : <Placeholder />}
      <Paragraph>{fileName}</Paragraph>
    </>
  )
}
