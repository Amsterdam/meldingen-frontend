'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { MeldingAttachmentWithFile } from '../../types'

import { deleteAttachmentAction } from '../actions'
import { Attachment } from './Attachment'

import styles from './Attachments.module.css'

type Props = {
  initialAttachments: MeldingAttachmentWithFile[]
}

export const Attachments = ({ initialAttachments }: Props) => {
  const t = useTranslations('remove-attachment')

  const [attachments, setAttachments] = useState(initialAttachments)
  const [deletingIds, setDeletingIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: number, fileName: string) => {
    const shouldDelete = window.confirm(t('confirmation-prompt', { fileName }))
    if (!shouldDelete) return

    setDeletingIds((ids) => [...ids, id])
    setError(null)

    const { error: deleteAttachmentError } = await deleteAttachmentAction(id)

    if (deleteAttachmentError) {
      setError(deleteAttachmentError)
      setDeletingIds((ids) => ids.filter((value) => value !== id))
      return
    }

    setAttachments((items) => items.filter((item) => item.id !== id))
    setDeletingIds((ids) => ids.filter((value) => value !== id))
  }

  return (
    <div className={styles.cardGrid}>
      {error && <p>{error}</p>}

      {attachments.map((attachment) => (
        <Attachment
          attachment={attachment}
          isDeleting={deletingIds.includes(attachment.id)}
          key={attachment.id}
          onDelete={() => handleDelete(attachment.id, attachment.originalFilename)}
        />
      ))}
    </div>
  )
}
