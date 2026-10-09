'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import type { MeldingAttachment } from '../types'

import { AttachmentPreview } from './AttachmentPreview'

import parentStyles from '../Detail.module.css'
import styles from './AttachmentSection.module.css'

type Props = {
  attachments: MeldingAttachment[]
  meldingId: number
}

export const AttachmentSection = ({ attachments, meldingId }: Props) => {
  const t = useTranslations('detail')

  const hasAttachments = attachments.length > 0
  const addAttachmentLink = `/melding/${meldingId}/bestand-toevoegen`
  const removeAttachmentLink = `/melding/${meldingId}/bestand-verwijderen`

  return (
    <dl className={clsx(parentStyles.descriptionList, parentStyles.cardWide, styles.attachmentsSection)}>
      <dt className={styles.attachmentsTerm}>{t('attachments.title')}</dt>

      {hasAttachments ? (
        <div className={styles.attachmentsWrapper}>
          {attachments.map(({ blob, createdAt, id, originalFilename, user }) => {
            const { date, time } = formatDateString(createdAt)
            return (
              <dd className={clsx(parentStyles.description, styles.attachmentWrapper)} key={id}>
                <AttachmentPreview
                  blob={blob}
                  fileName={originalFilename}
                  id={id}
                  isLinkToSlider
                  meldingId={meldingId}
                />
                <Paragraph>{`${date} ${time}`}</Paragraph>
                <Paragraph>{user ? user.email : t('attachments.melding-form-user')}</Paragraph>
              </dd>
            )
          })}
        </div>
      ) : (
        <dd className={styles.fullWidth}>
          <Paragraph>{t('attachments.no-data')}</Paragraph>
        </dd>
      )}

      <dd className={styles.fullWidth}>
        <Link href={addAttachmentLink} linkComponent={NextLink}>
          {t('attachments.add-link')}
        </Link>
      </dd>
      {hasAttachments && (
        <dd className={styles.fullWidth}>
          <Link href={removeAttachmentLink} linkComponent={NextLink}>
            {t('attachments.remove-link')}
          </Link>
        </dd>
      )}
    </dl>
  )
}
