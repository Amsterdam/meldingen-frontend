'use client'

import { Image } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

import styles from './FileListImage.module.css'

type Props = {
  file: File | { name: string }
}

const Placeholder = () => <div className={styles.placeholder} />

export const FileListImage = ({ file }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    // If 'file' is not a File instance (just a file name from the backend), show the placeholder.
    // This occurs when the backend has not yet made the file available for download directly after upload.
    if (!(file instanceof File)) return

    const objectUrl = URL.createObjectURL(file)

    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return url ? (
    <Image
      alt=""
      className={styles.image}
      src={url}
      width={256} // Fixed width for when CSS does not load. Gets overridden by CSS.
    />
  ) : (
    <Placeholder />
  )
}
