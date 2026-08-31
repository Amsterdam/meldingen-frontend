'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { GetAttachmentsDataResult } from '../../_utils/getAttachmentsData'

import { useRemoveAttachmentError } from '../_context/RemoveAttachmentErrorContext'
import { deleteAttachmentAction } from '../actions'
import { Attachment } from './Attachment'

import styles from './Attachments.module.css'

type Props = {
  attachments: GetAttachmentsDataResult
  meldingId: number
}

export const Attachments = ({ attachments: { attachmentsWithFile: initialAttachments }, meldingId }: Props) => {
  const { setApiError } = useRemoveAttachmentError()
  const router = useRouter()
  const t = useTranslations('remove-attachment')

  const [attachments, setAttachments] = useState(initialAttachments)
  const [deletingIds, setDeletingIds] = useState<number[]>([])

  const handleDelete = async (id: number, fileName: string) => {
    const shouldDelete = window.confirm(t('confirmation-prompt', { fileName }))
    if (!shouldDelete) return

    setDeletingIds((ids) => [...ids, id])
    setApiError(null)

    const { error: deleteAttachmentError } = await deleteAttachmentAction(id)

    if (deleteAttachmentError) {
      setApiError(deleteAttachmentError)
      setDeletingIds((ids) => ids.filter((value) => value !== id))
      return
    }

    const remainingAttachments = attachments.filter((item) => item.id !== id)

    if (remainingAttachments.length === 0) {
      router.push(`/melding/${meldingId}`)
      return
    }

    setAttachments(remainingAttachments)
    setDeletingIds((ids) => ids.filter((value) => value !== id))
  }

  return (
    <div className={styles.cardGrid}>
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
