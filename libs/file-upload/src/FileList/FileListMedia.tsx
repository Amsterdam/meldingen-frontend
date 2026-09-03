'use client'

import { Image } from '@amsterdam/design-system-react'
import { DocumentsIcon } from '@amsterdam/design-system-react-icons'
import { Icon } from '@amsterdam/design-system-react/dist/Icon'

import { useObjectUrl } from './useObjectUrl'

import styles from './FileListMedia.module.css'

type Props = {
  file: File | { name: string }
}

const Placeholder = () => <div className={styles.placeholder} />

export const FileListMedia = ({ file }: Props) => {
  const blob = file instanceof File ? file : null
  const url = useObjectUrl(blob)

  if (!url) return <Placeholder />

  const isPDF = file.name.toLowerCase().endsWith('.pdf')

  if (isPDF) {
    return (
      <div className={styles.pdf}>
        <Icon size="heading-1" svg={DocumentsIcon} />
      </div>
    )
  }

  return (
    <Image
      alt=""
      className={styles.image}
      src={url}
      width={256} // Fixed width for when CSS does not load. Gets overridden by CSS.
    />
  )
}
