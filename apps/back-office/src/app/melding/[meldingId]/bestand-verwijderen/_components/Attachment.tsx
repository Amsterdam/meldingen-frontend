'use client'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import { Column } from '@amsterdam/design-system-react/dist/Column'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import { Heading, Paragraph } from '@meldingen/ui'

import type { MeldingAttachment } from '../../types'

import { AttachmentPreview } from '../../_components/AttachmentPreview'

import styles from './Attachment.module.css'

type Props = {
  attachment: MeldingAttachment
  isDeleting: boolean
  meldingId: number
  onDelete: () => void
}

export const Attachment = ({
  attachment: { blob, createdAt, id, originalFilename, user },
  isDeleting,
  meldingId,
  onDelete,
}: Props) => {
  const t = useTranslations('remove-attachment')
  return (
    <Column alignHorizontal="start" className={clsx(styles.container, styles.cardWide)}>
      <Heading level={4}>{originalFilename}</Heading>
      <Column gap="x-small">
        <Paragraph>{createdAt}</Paragraph>
        <Paragraph>{user ? user.email : t('melding-form-user')}</Paragraph>
      </Column>
      <div className={styles.imagePreview}>
        <AttachmentPreview blob={blob} fileName={originalFilename} id={id} meldingId={meldingId} />
      </div>
      <Button
        aria-label={`${t('submit-button')} ${originalFilename}`}
        disabled={isDeleting}
        onClick={onDelete}
        variant="secondary"
      >
        {t('submit-button')}
      </Button>
    </Column>
  )
}
