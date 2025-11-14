'use client'

import { Image } from '@amsterdam/design-system-react'
import { useEffect, useState } from 'react'

import styles from './FileList.module.css'

type Props = {
  blob: Blob
}

const Loading = () => <div className={styles.loading} />

export const FileListImage = ({ blob }: Props) => {
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
      {url ? (
        <Image
          src={url}
          alt=""
          width={256} // Fixed width for when CSS does not load. Gets overridden by CSS.
        />
      ) : (
        <Loading />
      )}
    </>
  )
}
