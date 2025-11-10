'use client'

import { Alert, ErrorMessage, Paragraph } from '@amsterdam/design-system-react'
import { getAriaDescribedBy } from 'libs/form-renderer/src/utils'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from '@meldingen/api-client'
import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column, FileList, FileUpload, Heading, InvalidFormAlert, SubmitButton } from '@meldingen/ui'

import { submitAttachmentsForm } from './actions'
import type { ExistingFileType } from './page'
import type { FileUpload as FileUploadType } from './utils'
import { startUpload } from './utils'
import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from '../_utils/useSetFocusOnInvalidFormAlert'
import { handleApiError } from 'apps/melding-form/src/handleApiError'
import type { FormState } from 'apps/melding-form/src/types'

import styles from './Attachments.module.css'

const MAX_SUCCESSFUL_UPLOADS = 3
export const MAX_UPLOAD_ATTEMPTS = 10

type Props = {
  formData: StaticFormTextAreaComponentOutput[]
  meldingId: number
  token: string
  files: ExistingFileType[]
}

const initialState: Pick<FormState, 'systemError'> = {}

const createFileUploads = (
  newFiles: File[],
  currentFiles: FileUploadType[],
  t: (key: string) => string,
): FileUploadType[] =>
  newFiles.map((file) => {
    if (currentFiles.find((f) => f.file.name === file.name)) {
      return {
        file,
        id: crypto.randomUUID(),
        progress: 0,
        status: 'error',
        error: t('errors.duplicate-upload'),
      }
    }

    return {
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'pending',
      xhr: new XMLHttpRequest(),
    }
  })

const mapExistingFilesToUploads = (files: ExistingFileType[]): FileUploadType[] =>
  files.map((file) => ({
    ...file,
    id: crypto.randomUUID(),
    file: new File([file.blob], file.fileName),
    progress: 100,
    status: 'success',
  }))

export const Attachments = ({ files, formData, meldingId, token }: Props) => {
  const existingFileUploads = mapExistingFilesToUploads(files)

  const inputRef = useRef<HTMLInputElement>(null)
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [fileUploads, setFileUploads] = useState<FileUploadType[]>(existingFileUploads)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [deletedFileName, setDeletedFileName] = useState<string>()

  const [{ systemError }, formAction] = useActionState(submitAttachmentsForm, initialState)

  const validationErrors = fileUploads
    .filter((upload) => upload.status === 'error')
    .map((upload) => ({ key: upload.id, message: upload.error || '' }))

  const t = useTranslations('attachments')
  const tShared = useTranslations('shared')

  const { label, description } = formData[0]

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)

    if (!event.currentTarget.files) return

    const newFiles = Array.from(event.currentTarget.files)

    if (newFiles.length + fileUploads.length > MAX_UPLOAD_ATTEMPTS) {
      setErrorMessage(t('errors.too-many-attempts', { maxAttempts: MAX_UPLOAD_ATTEMPTS }))
      return
    }

    if (newFiles.length + fileUploads.filter((file) => file.status === 'success').length > MAX_SUCCESSFUL_UPLOADS) {
      setErrorMessage(t('errors.too-many-files', { maxFiles: MAX_SUCCESSFUL_UPLOADS }))
      return
    }

    const newFileUploads = createFileUploads(newFiles, fileUploads, t)

    setFileUploads((prev) => [...prev, ...newFileUploads])

    newFileUploads.forEach((upload) => {
      const xhr = upload.xhr

      if (!xhr) return

      xhr.open(
        'POST',
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/melding/${meldingId}/attachment?token=${encodeURIComponent(token)}`,
      )

      startUpload(xhr, upload, setFileUploads)
    })

    // Clear the file input after starting the upload, so it is empty for the next selection.
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => {
    setErrorMessage(undefined)

    // Abort upload if in progress
    if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
      xhr.abort()
      setFileUploads((fileUploads) => fileUploads.filter((upload) => upload.id !== id))
      setDeletedFileName(fileName)
      return
    }

    // If the file upload does not have a server id (because the server returned an error for example)
    // simply remove it from the list
    if (!serverId) {
      setFileUploads((fileUploads) => fileUploads.filter((upload) => upload.id !== id))
      setDeletedFileName(fileName)
      return
    }

    const { error } = await deleteMeldingByMeldingIdAttachmentByAttachmentId({
      path: {
        attachment_id: serverId,
        melding_id: meldingId,
      },
      query: { token },
    })

    if (error) {
      setErrorMessage(handleApiError(error))
      return
    }

    setFileUploads((fileUploads) => fileUploads.filter((upload) => upload.serverId !== serverId))
    setDeletedFileName(fileName)
  }

  // Set focus on InvalidFormAlert when there are validation errors
  useSetFocusOnInvalidFormAlert(invalidFormAlertRef, validationErrors)

  // Update document title when there are validation errors
  const documentTitle = getDocumentTitleOnError(t('metadata.title'), tShared, validationErrors)

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-s" href="/locatie">
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert />}
        {validationErrors.length > 0 && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={validationErrors.map((error) => ({
              id: `#${error.key}`,
              label: error.message,
            }))}
            heading={tShared('invalid-form-alert-title')}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}
        <FormHeader title={t('title')} step={t('step')} />

        <Column>
          <Column gap="small">
            <Heading id="file-upload-label" level={1} size="level-3">
              {label} <span className={styles.hint}>{t('hint-text')}</span>
            </Heading>
            {description && (
              <MarkdownToHtml id="file-upload-description" type="description">
                {description}
              </MarkdownToHtml>
            )}
            {errorMessage && <ErrorMessage id="file-upload-error-message">{errorMessage}</ErrorMessage>}
          </Column>

          <Column className={styles.needsJavaScript}>
            <Paragraph aria-live="assertive">
              {t('status', {
                fileCount: fileUploads.filter((upload) => upload.status === 'success').length,
                maxFiles: MAX_SUCCESSFUL_UPLOADS,
              })}
            </Paragraph>

            <FileUpload
              accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround,image/webp"
              aria-describedby={getAriaDescribedBy('file-upload', description, errorMessage)}
              aria-labelledby="file-upload-label file-upload"
              buttonText={t('file-upload.button')}
              dropAreaText={t('file-upload.drop-area')}
              id="file-upload"
              multiple
              onChange={handleUpload}
              ref={inputRef}
            />

            {fileUploads.length > 0 && (
              <FileList>
                {fileUploads.map(({ error, file, id, progress, serverId, status, xhr }) => (
                  <FileList.Item
                    actionButtonLabelDelete={t('file-upload.action-button-delete')}
                    actionButtonLabelCancel={t('file-upload.action-button-delete')}
                    progressLabelFinished={t('file-upload.progress-finished')}
                    progressLabelLoading={t('file-upload.progress-loading', { percentage: Math.round(progress) })}
                    deleteButtonId={id}
                    errorMessage={error}
                    file={file}
                    key={id}
                    onDelete={() => handleDelete(id, file.name, xhr, serverId)}
                    status={status}
                  />
                ))}
              </FileList>
            )}

            <div className="ams-visually-hidden" aria-live="polite">
              {deletedFileName ? t('delete-notification', { fileName: deletedFileName }) : ''}
            </div>
          </Column>

          <Alert className={styles.noJavaScriptAlert} heading={t('no-js-alert-title')} headingLevel={2}>
            <Paragraph>{t('no-js-alert-description')}</Paragraph>
          </Alert>

          <Form action={formAction}>
            <SubmitButton>{t('submit-button')}</SubmitButton>
          </Form>
        </Column>
      </main>
    </>
  )
}
