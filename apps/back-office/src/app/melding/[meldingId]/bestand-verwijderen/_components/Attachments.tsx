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
  const t = useTranslations('attachments.remove')

  const [attachments, setAttachments] = useState(initialAttachments)
  const [deletedFileName, setDeletedFileName] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: number, fileName: string) => {
    if (isDeleting) return

    const shouldDelete = window.confirm(t('confirmation-prompt', { fileName }))
    if (!shouldDelete) return

    setIsDeleting(true)
    setDeletedFileName(null)
    setApiError(null)

    const { error: deleteAttachmentError } = await deleteAttachmentAction(id)

    if (deleteAttachmentError) {
      setApiError(deleteAttachmentError)
      setIsDeleting(false)
      return
    }

    const remainingAttachments = attachments.filter((item) => item.id !== id)

    setDeletedFileName(fileName)

    if (remainingAttachments.length === 0) {
      router.replace(`/melding/${meldingId}`)
      return
    }

    setAttachments(remainingAttachments)
    setIsDeleting(false)
  }

  return (
    <>
      <div className={styles.cardGrid}>
        {attachments.map((attachment) => (
          <Attachment
            attachment={attachment}
            isDeleting={isDeleting}
            key={attachment.id}
            onDelete={() => handleDelete(attachment.id, attachment.originalFilename)}
          />
        ))}
      </div>
      <div aria-live="polite" className="ams-visually-hidden">
        {deletedFileName ? t('confirmation', { fileName: deletedFileName }) : ''}
      </div>
    </>
  )
}
