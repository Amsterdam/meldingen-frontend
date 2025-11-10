import { Image, Paragraph } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

import styles from './AttachmentImage.module.css'

type Props = {
  blob: Blob
  fileName: string
}

const Loading = () => <div className={styles.loading} />

export const AttachmentImage = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    setUrl(URL.createObjectURL(blob))

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <>
      {url ? <Image src={url} alt="" className={styles.image} /> : <Loading />}
      <Paragraph>{fileName}</Paragraph>
    </>
  )
}
