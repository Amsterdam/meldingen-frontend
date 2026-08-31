'use client'

import { Image, Paragraph } from '@amsterdam/design-system-react'
import { DocumentsIcon } from '@amsterdam/design-system-react-icons'
import { useTranslations } from 'next-intl'
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

  const t = useTranslations('detail.attachments')

  // This useEffect is necessary to avoid render problems while refreshing the page.
  useEffect(() => {
    if (!blob) return

    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => {
      if (!objectUrl) return

      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

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
        <span className="ams-visually-hidden">{t('visually-hidden-text', { fileName: fileName })}</span>
      </Link>
    )
  }

  return <Image alt="" src={url} />
}
