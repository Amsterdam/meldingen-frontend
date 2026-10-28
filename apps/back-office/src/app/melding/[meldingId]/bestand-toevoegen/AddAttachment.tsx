'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useId, useRef, useState } from 'react'

import type { ErroredFileUpload, FileUploadState } from '@meldingen/file-upload'

import { FileUpload, useFileUploads } from '@meldingen/file-upload'
import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { Column, FocusableAlert, Heading, Link, Paragraph } from '@meldingen/ui'

import type { MeldingAttachment } from '../types'

import { PageWrapper } from '../_components/PageWrapper'
import { deleteAttachmentAction } from './actions'
import { AttachmentsList } from './AttachmentsList'
import { InvalidFormAlert } from '~/app/_components'
import { clientEnv } from '~/env/client'

import styles from './AddAttachment.module.css'

type Props = {
  attachments: MeldingAttachment[]
  meldingId: number
}

const MAX_SUCCESSFUL_UPLOADS = 5
const MAX_UPLOAD_ATTEMPTS = 10

export const MAX_ATTACHMENT_SIZE_BYTES = 20 * 1024 * 1024

const deleteAttachment = async (serverId: number) => {
  const { error } = await deleteAttachmentAction(serverId)

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  return { error }
}

const isErroredFileUpload = (upload: FileUploadState): upload is ErroredFileUpload => upload.status === 'error'

export const AddAttachment = ({ attachments, meldingId }: Props) => {
  const t = useTranslations('add-attachment')

  const [invalidFormAlertFocusKey, setInvalidFormAlertFocusKey] = useState<string[]>([])

  const fileUploadId = useId()
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const existingFiles = attachments.map(({ blob, id, originalFilename }) => ({
    blob,
    fileName: originalFilename,
    serverId: id,
  }))

  const { deletedFileName, fileUploads, genericError, handleDelete, handleUpload } = useFileUploads({
    deleteAttachment,
    existingFiles,
    idPrefix: t('file-upload.id-prefix'),
    inputRef: fileUploadRef,
    maxFileSizeBytes: MAX_ATTACHMENT_SIZE_BYTES,
    maxSuccessfulUploads: MAX_SUCCESSFUL_UPLOADS,
    maxUploadAttempts: MAX_UPLOAD_ATTEMPTS,
    uploadUrl: `${clientEnv.NEXT_PUBLIC_BASE_PATH}/api/melding/${meldingId}/attachment`,
  })

  const handleOnDelete = (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => {
    const shouldDelete = window.confirm(t('confirmation-prompt', { fileName }))

    if (!shouldDelete) return

    handleDelete(id, fileName, xhr, serverId)
  }

  const erroredFileUploads = fileUploads.filter(isErroredFileUpload)
  const erroredFileUploadIds = erroredFileUploads.map(({ id }) => id)

  // Only update when a new upload fails, so deleting a failed upload does not refocus the alert
  if (erroredFileUploadIds.some((id) => !invalidFormAlertFocusKey.includes(id))) {
    setInvalidFormAlertFocusKey(erroredFileUploadIds)
  }

  const validationErrors = erroredFileUploads.map(({ errorMessage, id }) => ({
    key: id,
    message: t(errorMessage),
  }))

  const hasAttachments = fileUploads.length > 0
  const successfulUploadsCount = fileUploads.filter(({ status }) => status === 'success').length

  const meldingDetailLink = `/melding/${meldingId}`

  return (
    <PageWrapper backLink={{ href: meldingDetailLink, label: t('back-link') }}>
      <InvalidFormAlert
        errors={validationErrors}
        focusKey={invalidFormAlertFocusKey}
        heading={t('validation-errors.alert-title', { count: validationErrors.length })}
      />
      {genericError && !validationErrors.length && (
        <FocusableAlert
          className={clsx(styles.genericErrorAlert, 'ams-mb-m')}
          // useFileUploads sets a new object for every error, so repeated errors refocus the alert too
          focusKey={genericError}
          heading={t(genericError.title, genericError.options)}
        >
          {genericError.description && <Paragraph>{t(genericError.description)}</Paragraph>}
        </FocusableAlert>
      )}
      <Heading className="ams-mb-l" level={1}>
        {t('title')}
      </Heading>
      <Column className={clsx(styles.contentWrapper, 'ams-mb-m')}>
        <Column gap="small">
          <Heading id="file-upload-label" level={2} size="level-4">
            {t('upload.title')}
          </Heading>
          <Paragraph id="file-upload-description">{t('upload.description')}</Paragraph>
          <Paragraph>
            {t('upload.count', { currentCount: successfulUploadsCount, maxCount: MAX_SUCCESSFUL_UPLOADS })}
          </Paragraph>
        </Column>

        <FileUpload
          accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround,image/webp,.pdf"
          aria-describedby={getAriaDescribedBy(fileUploadId, t('upload.description'))}
          aria-labelledby={`file-upload-label ${fileUploadId}`}
          button={{
            text: t('file-upload.select-file-button'),
          }}
          dropAreaText={t('file-upload.drop-area')}
          id={fileUploadId}
          multiple
          onChange={handleUpload}
          ref={fileUploadRef}
        />
        {hasAttachments && (
          <>
            <AttachmentsList files={fileUploads} handleDelete={handleOnDelete} />

            <div aria-live="polite" className="ams-visually-hidden">
              {deletedFileName ? t('delete-notification', { fileName: deletedFileName }) : ''}
            </div>
          </>
        )}
      </Column>
      <Link href={meldingDetailLink}>{hasAttachments ? t('back-link') : t('cancel-link')}</Link>
    </PageWrapper>
  )
}
