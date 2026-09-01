'use client'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import type { MeldingAttachment } from '../../types'

import { AttachmentPreview } from '../../_components/AttachmentPreview'

import styles from './Attachment.module.css'

type Props = {
  attachment: MeldingAttachment
  isDeleting: boolean
  onDelete: () => void
}

export const Attachment = ({
  attachment: { blob, createdAt, originalFilename, user },
  isDeleting,
  onDelete,
}: Props) => {
  const t = useTranslations('attachments')
  return (
    <dl className={clsx(styles.container, styles.cardWide, 'ams-column')}>
      <dt className={styles.term}>{originalFilename}</dt>
      <div className="ams-column ams-column--gap-small">
        <dd className={styles.description}>{createdAt}</dd>
        <dd className={styles.description}>{user ? user.email : t('melding-form-user')}</dd>
      </div>
      <div className={styles.imagePreview}>
        <AttachmentPreview blob={blob} fileName={originalFilename} />
      </div>

      <Button
        aria-label={`${t('remove.submit-button')} ${originalFilename}`}
        disabled={isDeleting}
        onClick={onDelete}
        variant="secondary"
      >
        {t('remove.submit-button')}
      </Button>
    </dl>
  )
}
