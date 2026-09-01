'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'

import type { GetAttachmentsDataResult } from '../_utils/server/getAttachmentsData'
import type { FormDateStringOptions } from '~/app/_utils/formatDateString'

import { AttachmentPreview } from './AttachmentPreview'
import { ApiErrorAlert } from '~/app/_components'
import { formatDateString } from '~/app/_utils/formatDateString'

import parentStyles from '../Detail.module.css'
import styles from './AttachmentSection.module.css'

type Props = {
  attachments: GetAttachmentsDataResult
  meldingId: number
}

const formatDateStringOptions: FormDateStringOptions = {
  date: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  time: {
    hour: 'numeric',
    minute: 'numeric',
  },
}

export const AttachmentSection = ({ attachments: { attachmentsWithFile: attachments, error }, meldingId }: Props) => {
  const t = useTranslations('attachments')

  const hasAttachments = attachments.length > 0
  const addAttachmentLink = `/melding/${meldingId}/bestand-toevoegen`
  const removeAttachmentLink = `/melding/${meldingId}/bestand-verwijderen`

  return (
    <dl className={clsx(parentStyles.descriptionList, parentStyles.cardWide, styles.attachmentsSection)}>
      <dt className={styles.attachmentsTerm}>{t('title')}</dt>
      {error && <ApiErrorAlert description={t('fetch-error.description')} shouldFocus={false} />}

      {hasAttachments && !error ? (
        <div className={styles.attachmentsWrapper}>
          {attachments.map(({ blob, createdAt, id, originalFilename }) => {
            const { date, time } = formatDateString(createdAt, formatDateStringOptions)

            return (
              <dd className={clsx(parentStyles.description, styles.attachmentWrapper)} key={originalFilename}>
                <AttachmentPreview blob={blob} fileName={originalFilename} id={id} meldingId={meldingId} />
                <Paragraph>{`${date} ${time}`}</Paragraph>
                <Paragraph>{originalFilename}</Paragraph>
              </dd>
            )
          })}
        </div>
      ) : (
        <dd className={styles.fullWidth}>
          <Paragraph>{t('no-data')}</Paragraph>
        </dd>
      )}

      <dd className={styles.fullWidth}>
        <Link href={addAttachmentLink} linkComponent={NextLink}>
          {t('add-link')}
        </Link>
      </dd>
      {hasAttachments && (
        <dd className={styles.fullWidth}>
          <Link href={removeAttachmentLink} linkComponent={NextLink}>
            {t('remove-link')}
          </Link>
        </dd>
      )}
    </dl>
  )
}
