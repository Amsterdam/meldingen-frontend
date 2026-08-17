'use client'

import type { ChangeEvent } from 'react'

import { Alert } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

import type { ErroredFileUpload, FileUploadState, UploadResult } from '@meldingen/file-upload'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from '@meldingen/api-client'
import { FileUpload, useFileUploads } from '@meldingen/file-upload'
import { Grid, Heading, Link, Paragraph } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { uploadAttachmentAction } from './actions'
import { AttachmentsList } from './AttachmentsList'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'

import styles from './AddAttachment.module.css'

type AttachmentFile = {
  blob: Blob | null
  createdAt: string
  error?: string
  fileName: string
  id: number
}

type Attachment = {
  files: AttachmentFile[]
  key: string
  term: string
}

type Props = {
  attachments: Attachment
  meldingId: number
}

const MAX_SUCCESSFUL_UPLOADS = 5
const MAX_UPLOAD_ATTEMPTS = 10

const deleteAttachment = async (meldingId: number, token: string, serverId: number) => {
  const { error } = await deleteMeldingByMeldingIdAttachmentByAttachmentId({
    path: {
      attachment_id: serverId,
      melding_id: meldingId,
    },
    query: { token },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  return { error }
}

const uploadAttachment =
  (meldingId: number) =>
  async (file: File): Promise<UploadResult> => {
    const formData = new FormData()

    formData.set('file', file)

    const { apiError, serverId } = await uploadAttachmentAction(meldingId, file)

    return { error: apiError, serverId }
  }

const isErroredFileUpload = (upload: FileUploadState): upload is ErroredFileUpload => upload.status === 'error'

export const AddAttachment = ({ attachments, meldingId }: Props) => {
  const t = useTranslations('add-attachment')

  const genericErrorAlertRef = useRef<HTMLDivElement>(null)

  const [apiError, setApiError] = useState<string | null>(null)
  const [shouldFocusInvalidAlert, setShouldFocusInvalidAlert] = useState<boolean>(false)

  const fileUploadId = useId()
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const existingFiles = attachments.files.map((file) => ({
    blob: file.blob || undefined,
    fileName: file.fileName,
    serverId: file.id,
  }))

  const uploadFile = uploadAttachment(meldingId)
  const { deletedFileName, fileUploads, genericError, handleDelete, handleUpload } = useFileUploads({
    deleteAttachment: (serverId: number) => deleteAttachment(meldingId, 'token', serverId),
    existingFiles,
    idPrefix: t('file-upload.id-prefix'),
    inputRef: fileUploadRef,
    maxSuccessfulUploads: MAX_SUCCESSFUL_UPLOADS,
    maxUploadAttempts: MAX_UPLOAD_ATTEMPTS,
    uploadFile: async (file: File) => {
      const { error, serverId } = await uploadFile(file)

      if (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
        setApiError(error)
      }

      return { error, serverId }
    },
  })

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setShouldFocusInvalidAlert(false)
    handleUpload(event)
  }

  // Set focus on generic Alert when there is a generic error
  useEffect(() => {
    if (!genericError || !genericErrorAlertRef.current) return

    genericErrorAlertRef.current.focus()
  }, [genericError])

  const erroredFileUploads = fileUploads.filter(isErroredFileUpload)
  const hasErroredFileUploads = erroredFileUploads.length > 0
  const validationErrors = erroredFileUploads.map(({ errorMessage, id }) => ({
    key: id,
    message: t(errorMessage),
  }))

  useEffect(() => {
    if (!hasErroredFileUploads) return

    setShouldFocusInvalidAlert(true)
  }, [hasErroredFileUploads])

  const hasAttachments = fileUploads.length > 0

  const validUploadedFilesCount = fileUploads.length - erroredFileUploads.length
  const meldingDetailLink = `/melding/${meldingId}`

  return (
    <div className="ams-page__area--body">
      <BackLink href={meldingDetailLink}>{t('back-link')}</BackLink>

      <Grid as="main" className="ams-page__area--content ams-mb-l">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(apiError) && <ApiErrorAlert shouldFocus={true} />}

          {genericError && (
            <Alert
              className={clsx(styles.genericErrorAlert, 'ams-mb-m')}
              heading={t(genericError.title, genericError.options)}
              headingLevel={2}
              ref={genericErrorAlertRef}
              role="alert"
              severity="error"
              tabIndex={-1}
            >
              {genericError.description && <Paragraph>{t(genericError.description)}</Paragraph>}
            </Alert>
          )}

          <InvalidFormAlert
            errors={validationErrors}
            heading={t('validation-errors.alert-title', { count: validationErrors.length })}
            shouldFocus={shouldFocusInvalidAlert}
          />

          <Heading className="ams-mb-l" level={1}>
            {t('title')}
          </Heading>

          <div className={styles.contentWrapper}>
            <div className={styles.uploadInfo}>
              <Heading level={4}>{t('upload.title')}</Heading>
              <Paragraph>{t('upload.description')}</Paragraph>
              <Paragraph>{t('upload.count', { currentCount: validUploadedFilesCount, maxCount: 5 })}</Paragraph>

              <FileUpload
                accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround,image/webp"
                // aria-describedby={getAriaDescribedBy(fileUploadId, description)}
                aria-labelledby={`file-upload-label ${fileUploadId}`}
                buttonText={t('file-upload.select-file-button')}
                dropAreaText={t('file-upload.drop-area')}
                id={fileUploadId}
                multiple
                onChange={onUpload}
                ref={fileUploadRef}
              />
            </div>

            {hasAttachments && (
              <>
                <AttachmentsList files={fileUploads} handleDelete={handleDelete} />

                <div aria-live="polite" className="ams-visually-hidden">
                  {deletedFileName ? t('delete-notification', { fileName: deletedFileName }) : ''}
                </div>
              </>
            )}
          </div>

          <Link href={meldingDetailLink}>{hasAttachments ? t('back-link') : t('cancel-link')}</Link>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
