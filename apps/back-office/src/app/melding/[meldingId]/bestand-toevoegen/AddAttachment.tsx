'use client'

import type { ChangeEvent } from 'react'

import { Alert } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

import type { ErroredFileUpload, FileUploadState, UploadResult } from '@meldingen/file-upload'

import { FileUpload, useFileUploads } from '@meldingen/file-upload'
import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { Column, Grid, Heading, Link, Paragraph } from '@meldingen/ui'

import type { MeldingAttachment } from '../types'

import { BackLink } from '../_components/BackLink'
import { deleteAttachmentAction, uploadAttachmentAction } from './actions'
import { AttachmentsList } from './AttachmentsList'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'

import styles from './AddAttachment.module.css'

type Props = {
  attachments: MeldingAttachment[]
  meldingId: number
}

const MAX_SUCCESSFUL_UPLOADS = 5
const MAX_UPLOAD_ATTEMPTS = 10

export const uploadAttachment =
  (meldingId: number) =>
  async (file: File): Promise<UploadResult> => {
    // Instead of getting an uncatchable next.js server action error when the file is too large, we check the file size here and return a validation error.
    // Check if the file size exceeds 20 MB (20 * 1024 * 1024 bytes)
    if (file.size > 20 * 1024 * 1024) {
      return { error: 'Allowed content size exceeded', serverId: undefined }
    }

    const { error, serverId } = await uploadAttachmentAction(meldingId, file)

    return { error, serverId }
  }

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
  const t = useTranslations('attachments')

  const genericErrorAlertRef = useRef<HTMLDivElement>(null)

  const [apiError, setApiError] = useState<string | null>(null)
  const [shouldFocusInvalidAlert, setShouldFocusInvalidAlert] = useState<boolean>(false)

  const fileUploadId = useId()
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const existingFiles = attachments.map(({ blob, id, originalFilename }) => ({
    blob: blob || undefined,
    fileName: originalFilename,
    serverId: id,
  }))

  const uploadFile = uploadAttachment(meldingId)
  const { deletedFileName, fileUploads, genericError, handleDelete, handleUpload } = useFileUploads({
    deleteAttachment,
    existingFiles,
    idPrefix: t('add.file-upload.id-prefix'),
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

  const handleOnDelete = (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => {
    const shouldDelete = window.confirm(t('remove.confirmation-prompt', { fileName }))

    if (!shouldDelete) return

    handleDelete(id, fileName, xhr, serverId)
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
    message: t(`add.${errorMessage}`),
  }))

  useEffect(() => {
    if (!hasErroredFileUploads) return

    setShouldFocusInvalidAlert(true)
  }, [hasErroredFileUploads])

  const successfulUploadsCount = fileUploads.filter(({ status }) => status === 'success').length

  const hasAttachments = successfulUploadsCount > 0
  const validUploadedFilesCount = successfulUploadsCount - erroredFileUploads.length

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
            heading={t('add.validation-errors.alert-title', { count: validationErrors.length })}
            shouldFocus={shouldFocusInvalidAlert}
          />

          <Heading className="ams-mb-l" level={1}>
            {t('add.title')}
          </Heading>

          <Column className={clsx(styles.contentWrapper, 'ams-mb-m')}>
            <div className={styles.uploadInfo}>
              <Heading id="file-upload-label" level={2} size="level-4">
                {t('add.upload.title')}
              </Heading>
              <Paragraph id="file-upload-description">{t('add.upload.description')}</Paragraph>
              <Paragraph>{t('add.upload.count', { currentCount: validUploadedFilesCount, maxCount: 5 })}</Paragraph>
            </div>

            <FileUpload
              accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround,image/webp,.pdf"
              aria-describedby={getAriaDescribedBy(fileUploadId, t('add.upload.description'))}
              aria-labelledby={`file-upload-label ${fileUploadId}`}
              buttonText={t('add.file-upload.select-file-button')}
              dropAreaText={t('add.file-upload.drop-area')}
              id={fileUploadId}
              multiple
              onChange={onUpload}
              ref={fileUploadRef}
            />

            {hasAttachments && (
              <>
                <AttachmentsList files={fileUploads} handleDelete={handleOnDelete} />

                <div aria-live="polite" className="ams-visually-hidden">
                  {deletedFileName ? t('add.delete-notification', { fileName: deletedFileName }) : ''}
                </div>
              </>
            )}
          </Column>

          <Link href={meldingDetailLink}>{hasAttachments ? t('back-link') : t('add.cancel-link')}</Link>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
