'use client'

import { DocumentsIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

import { Icon, Link, Paragraph } from '@meldingen/ui'

import styles from './AttachmentPDF.module.css'

type Props = {
  blob: Blob | null
  fileName: string
}

export const AttachmentPDF = ({ blob, fileName }: Props) => {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!blob) return
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

  if (!blob || !url) return <Paragraph>{fileName}</Paragraph>

  return (
    <Link
      className={styles.attachmentPdf}
      href={url}
      linkComponent={NextLink}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon size="heading-1" svg={DocumentsIcon} />
    </Link>
  )
}
