'use client'

import styles from './AddAttachment.module.css'

import { Button } from '@amsterdam/design-system-react'
import { Grid, Heading, Link, Paragraph, UnorderedList } from '@meldingen/ui'
import { useTranslations } from 'next-intl'
import { AttachmentImage } from '../_components/AttachmentImage'
import { BackLink } from '../_components/BackLink'

type File = {
  blob: Blob | null
  createdAt: string
  error?: string
  fileName: string
}

type Attachment = {
  key: string
  term: string
  files: File[]
}

type Props = {
  meldingId: number
  attachments: Attachment
}

function AddAttachment({ meldingId, attachments }: Props) {
  const meldingDetailLink = `/melding/${meldingId}`

  const t = useTranslations('add-attachment')

  const hasAttachments = attachments.files.length > 0

  return (
    <div className="ams-page__area--body">
      <BackLink href={meldingDetailLink}>{t('back-link')}</BackLink>
      <Grid as="main" className="ams-page__area--content">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-l" level={1}>
            {t('title')}
          </Heading>

          <div className={styles.contentWrapper}>
            <div className={styles.uploadInfo}>
              <Heading level={4}>{t('upload.title')}</Heading>
              <Paragraph>{t('upload.description')}</Paragraph>
              <p>{t('upload.count', { currentCount: 0, maxCount: 5 })}</p>
              <Button>{t('submit-button')}</Button>
            </div>

            {hasAttachments && (
              <UnorderedList markers={false} className={styles.attachmentsList}>
                {attachments.files.map(({ fileName, blob, createdAt }) => (
                  <UnorderedList.Item key={fileName} className={styles.attachmentListItem}>
                    <AttachmentImage blob={blob} fileName={fileName} />

                    <Paragraph className="ams-mt-s">{fileName}</Paragraph>

                    <Button variant="secondary">{t('delete-button')}</Button>
                  </UnorderedList.Item>
                ))}
              </UnorderedList>
            )}
          </div>
        </Grid.Cell>

        <Link href={meldingDetailLink} className="ams-mt-l">
          {hasAttachments ? t('back-link') : t('cancel-link')}
        </Link>
      </Grid>
    </div>
  )
}

export default AddAttachment
