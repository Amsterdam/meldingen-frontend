'use client'

import { Image } from '@amsterdam/design-system-react'

import { useObjectUrl } from './useObjectUrl'

import styles from './FileListImage.module.css'

type Props = {
  file: File | { name: string }
}

const Placeholder = () => <div className={styles.placeholder} />

export const FileListImage = ({ file }: Props) => {
  const blob = file instanceof File ? file : null
  const url = useObjectUrl(blob)

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
