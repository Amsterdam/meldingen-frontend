'use client'

import { Image, Paragraph } from '@amsterdam/design-system-react'
import { DocumentsIcon } from '@amsterdam/design-system-react-icons'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { useObjectUrl } from '@meldingen/file-upload'
import { Icon, Link } from '@meldingen/ui'

import { isFilePDF } from '../_utils'

import styles from './AttachmentPreview.module.css'

type Props = {
  blob: Blob | null
  fileName: string
  id: number
  meldingId: number
}

export const AttachmentPreview = ({ blob, fileName, id, meldingId }: Props) => {
  const t = useTranslations('detail.attachments')
  const url = useObjectUrl(blob)

  if (!blob || !url) {
    return <Paragraph>{fileName}</Paragraph>
  }

  if (isFilePDF(fileName)) {
    return (
      <Link
        className={styles.attachmentPdf}
        href={url}
        linkComponent={NextLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon size="heading-1" svg={DocumentsIcon} />
        <span className="ams-visually-hidden">{t('pdf-link', { fileName })}</span>
      </Link>
    )
  }

  return (
    <Link href={`/melding/${meldingId}/foto?id=${id}`} linkComponent={NextLink}>
      <Image alt="" src={url} />
      <span className="ams-visually-hidden">{t('photo-link', { fileName })}</span>
    </Link>
  )
}
