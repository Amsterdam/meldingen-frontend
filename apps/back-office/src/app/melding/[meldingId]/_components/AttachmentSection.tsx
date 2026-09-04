'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import type { GetAttachmentsDataResult } from '../_utils/server/getAttachmentsData'

import { AttachmentPreview } from './AttachmentPreview'
import { ApiErrorAlert } from '~/app/_components'

import parentStyles from '../Detail.module.css'
import styles from './AttachmentSection.module.css'

type Props = {
  attachments: GetAttachmentsDataResult
  meldingId: number
}

export const AttachmentSection = ({ attachments: { attachmentsWithFile: attachments, error }, meldingId }: Props) => {
  const t = useTranslations('detail')

  const hasAttachments = attachments.length > 0
  const addAttachmentLink = `/melding/${meldingId}/bestand-toevoegen`
  const removeAttachmentLink = `/melding/${meldingId}/bestand-verwijderen`

  return (
    <dl className={clsx(parentStyles.descriptionList, parentStyles.cardWide, styles.attachmentsSection)}>
      <dt className={styles.attachmentsTerm}>{t('attachments.title')}</dt>
      {error && <ApiErrorAlert description={t('errors.fetch-error')} shouldFocus={false} />}

      {hasAttachments && !error ? (
        <div className={styles.attachmentsWrapper}>
          {attachments.map(({ blob, createdAt, id, originalFilename }) => {
            const { date, time } = formatDateString(createdAt)
            return (
              <dd className={clsx(parentStyles.description, styles.attachmentWrapper)} key={originalFilename}>
                <AttachmentPreview
                  blob={blob}
                  fileName={originalFilename}
                  id={id}
                  isLinkToSlider
                  meldingId={meldingId}
                />
                <Paragraph>{`${date} ${time}`}</Paragraph>
                <Paragraph>{originalFilename}</Paragraph>
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
