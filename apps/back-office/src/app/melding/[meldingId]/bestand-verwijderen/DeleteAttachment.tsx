'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Heading } from '@meldingen/ui'

import type { MeldingAttachment } from '../types'

import { PageWrapper } from '../_components/PageWrapper'
import { Attachment } from './_components/Attachment'
import { deleteAttachmentAction } from './actions'
import { ApiErrorAlert } from '~/app/_components'

import styles from './DeleteAttachment.module.css'

type Props = {
  attachments: MeldingAttachment[]
  meldingId: number
}

export const DeleteAttachment = ({ attachments: initialAttachments, meldingId }: Props) => {
  const [apiError, setApiError] = useState<string>()
  const router = useRouter()
  const t = useTranslations('remove-attachment')
  const backLinkHref = `/melding/${meldingId}`

  const [attachments, setAttachments] = useState(initialAttachments)
  const [deletedFileName, setDeletedFileName] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: number, fileName: string) => {
    if (isDeleting) return

    const shouldDelete = window.confirm(t('confirmation-prompt', { fileName }))

    if (!shouldDelete) return

    setIsDeleting(true)
    setDeletedFileName(null)
    setApiError(undefined)

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
    <PageWrapper backLink={{ href: backLinkHref, label: t('back-link') }}>
      {!!apiError && (
        <ApiErrorAlert
          description={t('error-delete-failed.description')}
          heading={t('error-delete-failed.title')}
          shouldFocus={true}
        />
      )}
      <Heading className="ams-mb-l" level={1}>
        {t('title')}
      </Heading>
      <div className={styles.cardGrid}>
        {attachments.map((attachment) => (
          <Attachment
            attachment={attachment}
            isDeleting={isDeleting}
            key={attachment.id}
            meldingId={meldingId}
            onDelete={() => handleDelete(attachment.id, attachment.originalFilename)}
          />
        ))}
      </div>
      <div aria-live="polite" className="ams-visually-hidden">
        {deletedFileName ? t('confirmation', { fileName: deletedFileName }) : ''}
      </div>
    </PageWrapper>
  )
}
