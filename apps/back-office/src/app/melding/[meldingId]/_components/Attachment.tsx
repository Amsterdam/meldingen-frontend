'use client'

import { Image, Paragraph } from '@amsterdam/design-system-react'
import { DocumentsIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

import { Icon, Link } from '@meldingen/ui'

import { isFilePDF } from '../_utils'

import styles from './Attachment.module.css'

type Props = {
  blob: Blob | null
  fileName: string
}

export const Attachment = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  // This useEffect is necessary to avoid render problems while refreshing the page.
  useEffect(() => {
    if (!blob) return

    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => {
      if (!objectUrl) return

      URL.revokeObjectURL(objectUrl)
    }
  }, [])

  if (!blob || !url) return <Paragraph>{fileName}</Paragraph>

  const isPDF = isFilePDF(fileName)

  if (isPDF) {
    return (
      <Link
        className={styles.attachmentPdf}
        href={url}
        linkComponent={NextLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon size="heading-1" svg={DocumentsIcon} />
        <span className="ams-visually-hidden">{fileName}</span>
      </Link>
    )
  }

  return <Image alt="" src={url} />
}
