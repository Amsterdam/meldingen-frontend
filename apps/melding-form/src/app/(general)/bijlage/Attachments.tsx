'use client'

import type { ChangeEvent } from 'react'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from '@meldingen/api-client'
import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column, FileList, FileUpload, Heading, SubmitButton } from '@meldingen/ui'

import type { ExistingFileType } from './page'
import type { FormState } from '~/types'

import { useDocumentTitleOnError } from '../_utils/validation'
import { BackLink } from '../../_components'
import { useFileUploads } from './_utils/useFileUploads'
import { submitAttachmentsForm } from './actions'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './Attachments.module.css'

const MAX_SUCCESSFUL_UPLOADS = 3
export const MAX_UPLOAD_ATTEMPTS = 10

export type Props = {
  files: ExistingFileType[]
  formData: StaticFormTextAreaComponentOutput[]
  meldingId: number
  token: string
}

const deleteAttachment = async (meldingId: number, token: string, serverId: number) => {
  const { error } = await deleteMeldingByMeldingIdAttachmentByAttachmentId({
    path: {
      attachment_id: serverId,
      melding_id: meldingId,
    },
    query: { token },
  })

  return { error: Boolean(error) }
}

const initialState: Pick<FormState, 'apiError'> = {}

export const Attachments = ({ files, formData, meldingId, token }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const genericErrorAlertRef = useRef<HTMLDivElement>(null)

  const t = useTranslations('attachments')
  const tShared = useTranslations('shared')

  const [shouldFocusAlert, setShouldFocusAlert] = useState(false)

  const [{ apiError }, formAction, isPending] = useActionState(submitAttachmentsForm, initialState)

  const { deletedFileName, fileUploads, genericError, handleDelete, handleSubmit, handleUpload } = useFileUploads({
    deleteAttachment: (serverId: number) => deleteAttachment(meldingId, token, serverId),
    existingFiles: files,
    idPrefix: t('file-upload.id-prefix'),
    inputRef,
    maxSuccessfulUploads: MAX_SUCCESSFUL_UPLOADS,
    maxUploadAttempts: MAX_UPLOAD_ATTEMPTS,
    uploadUrl: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/melding/${meldingId}/attachment?token=${encodeURIComponent(token)}`,
  })

  const erroredFileUploads = fileUploads.filter(({ status }) => status === 'error')
  const erroredFileUploadsKey = erroredFileUploads.map(({ id }) => id).join(',')
  const validationErrors = erroredFileUploads.map(({ errorMessage, id }) => ({
    key: id,
    message: errorMessage ? t(errorMessage) : '',
  }))

  const { description, label } = formData[0]

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setShouldFocusAlert(false)
    handleUpload(event)
  }

  // Update document title when there are API, validation or generic errors
  const baseDocumentTitle = `${label} - ${tShared('organisation-name')}`
  const documentTitle = useDocumentTitleOnError({
    baseDocumentTitle,
    hasApiError: Boolean(apiError) || Boolean(genericError),
    validationErrorCount: validationErrors.length,
  })

  // Set focus on generic Alert when there is a generic error
  useEffect(() => {
    if (genericError && genericErrorAlertRef.current) {
      genericErrorAlertRef.current.focus()
    }
  }, [genericError])

  // Set shouldFocusAlert to true when the list of validation errors changes
  useEffect(() => {
    if (erroredFileUploadsKey) setShouldFocusAlert(true)
  }, [erroredFileUploadsKey])

  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    if (apiError) console.error(apiError)
  }, [apiError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={`/locatie#${TOP_ANCHOR_ID}`}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(apiError) && <ApiErrorAlert shouldFocus={!isPending} />}
        <InvalidFormAlert
          errors={validationErrors}
          heading={t('validation-errors.alert-title', { count: validationErrors.length })}
          shouldFocus={shouldFocusAlert}
        />
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
        <Column className="ams-mb-l">
          <Column gap="small">
            <Heading id="file-upload-label" level={1} size="level-3">
              {label} <span className={styles.hint}>{t('hint-text')}</span>
            </Heading>
            {description && (
              <MarkdownToHtml id="file-upload-description" type="description">
                {description}
              </MarkdownToHtml>
            )}
          </Column>

          <div className={styles.needsJavaScript}>
            <Paragraph aria-live="assertive" className="ams-mb-m">
              {t('status', {
                fileCount: fileUploads.filter((upload) => upload.status === 'success').length,
                maxFiles: MAX_SUCCESSFUL_UPLOADS,
              })}
            </Paragraph>

            <FileUpload
              accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround,image/webp"
              aria-describedby={getAriaDescribedBy('file-upload', description)}
              aria-labelledby="file-upload-label file-upload"
              buttonText={t('file-upload.button')}
              dropAreaText={t('file-upload.drop-area')}
              id="file-upload"
              multiple
              onChange={onUpload}
              ref={inputRef}
            />

            {fileUploads.length > 0 && (
              <FileList>
                {fileUploads.map(({ errorMessage, file, id, progress, serverId, status, xhr }) => (
                  <FileList.Item
                    deleteButtonId={id}
                    errorMessage={errorMessage ? t(errorMessage) : undefined}
                    file={file}
                    key={id}
                    labels={{
                      actionButtonCancelLabel: t('file-upload.action-button-cancel'),
                      actionButtonDeleteLabel: t('file-upload.action-button-delete'),
                      progressFinishedLabel: t('file-upload.progress-finished'),
                      progressLoadingLabel: t('file-upload.progress-loading', { percentage: Math.round(progress) }),
                    }}
                    onDelete={() => handleDelete(id, file.name, xhr, serverId)}
                    status={status}
                  />
                ))}
              </FileList>
            )}

            <div aria-live="polite" className="ams-visually-hidden">
              {deletedFileName ? t('delete-notification', { fileName: deletedFileName }) : ''}
            </div>
          </div>

          <div className={styles.loadingContainer}>
            <Alert className={styles.noJavaScriptAlert} heading={t('no-js-alert-title')} headingLevel={2}>
              <Paragraph>{t('no-js-alert-description')}</Paragraph>
            </Alert>
          </div>
        </Column>
        <Form action={formAction} onSubmit={handleSubmit}>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
