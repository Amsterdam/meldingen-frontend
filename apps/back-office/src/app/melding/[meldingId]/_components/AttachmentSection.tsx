'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'

import type { Attachments } from '../types'
import type { FormDateStringOptions } from '~/app/_utils/formatDateString'

import { AttachmentPreview } from './AttachmentPreview'
import { formatDateString } from '~/app/_utils/formatDateString'

import parentStyles from '../Detail.module.css'
import styles from './AttachmentSection.module.css'

type Props = {
  attachments: Attachments
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

export const AttachmentSection = ({ attachments, meldingId }: Props) => {
  const t = useTranslations('detail')

  const hasAttachments = attachments.files.length > 0
  const addAttachmentLink = `/melding/${meldingId}/bestand-toevoegen`

  return (
    <dl className={clsx(parentStyles.descriptionList, parentStyles.cardWide, styles.attachmentsSection)}>
      <dt className={styles.attachmentsTerm}>{t('attachments.title')}</dt>

      {hasAttachments ? (
        <div className={styles.attachmentsWrapper}>
          {attachments.files.map(({ blob, createdAt, fileName, id }) => {
            const { date, time } = formatDateString(createdAt, formatDateStringOptions)

            return (
              <dd className={clsx(parentStyles.description, styles.attachmentWrapper)} key={fileName}>
                <AttachmentPreview blob={blob} fileName={fileName} id={id} meldingId={meldingId} />
                <Paragraph>{`${date} ${time}`}</Paragraph>
                <Paragraph>{fileName}</Paragraph>
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
    </dl>
  )
}
