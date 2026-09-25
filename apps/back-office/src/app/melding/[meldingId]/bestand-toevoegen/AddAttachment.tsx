'use client'

import type { ChangeEvent } from 'react'

import { Alert } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

import type { ErroredFileUpload, FileUploadState } from '@meldingen/file-upload'

import { FileUpload, useFileUploads } from '@meldingen/file-upload'
import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { Column, Grid, Heading, Link, Paragraph } from '@meldingen/ui'

import type { MeldingAttachment } from '../types'

import { BackLink } from '../_components/BackLink'
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

  const genericErrorAlertRef = useRef<HTMLDivElement>(null)

  const [shouldFocusInvalidAlert, setShouldFocusInvalidAlert] = useState<boolean>(false)

  const fileUploadId = useId()
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const existingFiles = attachments.map(({ blob, id, originalFilename }) => ({
    blob: blob || undefined,
    fileName: originalFilename,
    serverId: id,
  }))

  const { deletedFileName, fileUploads, genericError, handleDelete, handleUpload } = useFileUploads({
    deleteAttachment,
    existingFiles,
    idPrefix: t('file-upload.id-prefix'),
    inputRef: fileUploadRef,
    maxSuccessfulUploads: MAX_SUCCESSFUL_UPLOADS,
    maxUploadAttempts: MAX_UPLOAD_ATTEMPTS,
    uploadUrl: `${clientEnv.NEXT_PUBLIC_BASE_PATH}/api/melding/${meldingId}/attachment`,
  })

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setShouldFocusInvalidAlert(false)
    handleUpload(event)
  }

  const handleOnDelete = (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => {
    const shouldDelete = window.confirm(t('confirmation-prompt', { fileName }))

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
    message: t(errorMessage),
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

          <Column className={clsx(styles.contentWrapper, 'ams-mb-m')}>
            <Column gap="small">
              <Heading id="file-upload-label" level={2} size="level-4">
                {t('upload.title')}
              </Heading>
              <Paragraph id="file-upload-description">{t('upload.description')}</Paragraph>
              <Paragraph>{t('upload.count', { currentCount: validUploadedFilesCount, maxCount: 5 })}</Paragraph>
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
              onChange={onUpload}
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
        </Grid.Cell>
      </Grid>
    </div>
  )
}
