'use client'

import type { ChangeEvent, FormEvent } from 'react'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column, FileList, FileUpload, Heading, InvalidFormAlert, SubmitButton } from '@meldingen/ui'

import type { ExistingFileType } from './page'
import type { FileUpload as FileUploadType, PendingFileUpload } from './utils'
import type { FormState } from 'apps/melding-form/src/types'

import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/getDocumentTitleOnError'
import { submitAttachmentsForm } from './actions'
import { startUpload } from './utils'
import { getAriaDescribedBy } from 'libs/form-renderer/src/utils'

import styles from './Attachments.module.css'

const MAX_SUCCESSFUL_UPLOADS = 3
export const MAX_UPLOAD_ATTEMPTS = 10

type GenericErrorMessage = {
  description?: string
  options?: Record<string, string | number>
  title: string
}

export type Props = {
  files: ExistingFileType[]
  formData: StaticFormTextAreaComponentOutput[]
  meldingId: number
  token: string
}

const initialState: Pick<FormState, 'systemError'> = {}

const createDuplicatedUploadError = (file: File, errorMessage: string, id: string): FileUploadType => ({
  errorMessage,
  file,
  id,
  progress: 0,
  status: 'error',
})

const createFileUpload = (file: File, id: string): PendingFileUpload => ({
  file,
  id,
  progress: 0,
  status: 'pending',
  xhr: new XMLHttpRequest(),
})

const mapExistingFilesToUploads = (files: ExistingFileType[], idPrefix: string): FileUploadType[] =>
  files.map(({ blob, fileName, serverId }, index) => ({
    file: blob ? new File([blob], fileName) : { name: fileName },
    id: `${idPrefix}-${index + 1}`,
    progress: 100,
    serverId,
    status: 'success',
  }))

export const Attachments = ({ files, formData, meldingId, token }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadIdCounter = useRef(files.length)

  const genericErrorAlertRef = useRef<HTMLDivElement>(null)
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const t = useTranslations('attachments')
  const tShared = useTranslations('shared')

  const existingFileUploads = mapExistingFilesToUploads(files, t('file-upload.id-prefix'))

  const [fileUploads, setFileUploads] = useState<(FileUploadType | PendingFileUpload)[]>(existingFileUploads)
  const [genericError, setGenericError] = useState<GenericErrorMessage>()
  const [deletedFileName, setDeletedFileName] = useState<string>()

  const [{ systemError }, formAction] = useActionState(submitAttachmentsForm, initialState)

  const validationErrors = fileUploads
    .filter((upload) => upload.status === 'error')
    .map((upload) => ({ key: upload.id, message: upload.errorMessage || '' }))

  const { description, label } = formData[0]

  const getNextUploadId = () => {
    uploadIdCounter.current += 1
    return `${t('file-upload.id-prefix')}-${uploadIdCounter.current}`
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setGenericError(undefined)

    if (!event.currentTarget.files) return

    const newFiles = Array.from(event.currentTarget.files)

    if (newFiles.length + fileUploads.length > MAX_UPLOAD_ATTEMPTS) {
      setGenericError({
        description: 'errors.too-many-attempts.description',
        title: 'errors.too-many-attempts.title',
      })
      return
    }

    if (newFiles.length + fileUploads.filter((file) => file.status !== 'error').length > MAX_SUCCESSFUL_UPLOADS) {
      setGenericError({
        options: { maxFiles: MAX_SUCCESSFUL_UPLOADS },
        title: 'errors.too-many-files.title',
      })
      return
    }

    const newFileUploads = newFiles.map((newFile) => {
      if (fileUploads.find((f) => f.file.name === newFile.name)) {
        return createDuplicatedUploadError(newFile, 'validation-errors.duplicate-upload', getNextUploadId())
      }

      return createFileUpload(newFile, getNextUploadId())
    })

    setFileUploads((prev) => [...prev, ...newFileUploads])
    const validFileUploads = newFileUploads.filter((upload) => upload.status === 'pending')

    validFileUploads.forEach((upload) => {
      const xhr = upload.xhr

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
    setGenericError(undefined)

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
      setGenericError({
        description: 'errors.delete-failed.description',
        title: 'errors.delete-failed.title',
      })
      return
    }

    setFileUploads((fileUploads) => fileUploads.filter((upload) => upload.serverId !== serverId))
    setDeletedFileName(fileName)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (fileUploads.some((u) => u.status === 'uploading')) {
      e.preventDefault()
      setGenericError({
        description: 'errors.upload-in-progress.description',
        title: 'errors.upload-in-progress.title',
      })
    }
  }

  // Update document title when there are system, validation or generic errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(systemError) || Boolean(genericError),
    originalDocTitle: t('metadata.title'),
    translateFunction: tShared,
    validationErrorCount: validationErrors.length,
  })

  // Set focus on alerts when there are errors
  useEffect(() => {
    if (validationErrors && invalidFormAlertRef.current) {
      invalidFormAlertRef.current.focus()
    } else if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    } else if (genericError && genericErrorAlertRef.current) {
      genericErrorAlertRef.current.focus()
    }
  }, [validationErrors, systemError, genericError])

  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    if (systemError) console.error(systemError)
  }, [systemError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-s" href="/locatie">
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors.length > 0 && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={validationErrors.map((error) => ({
              id: `#${error.key}`,
              label: t(error.message),
            }))}
            heading={tShared('generic-error-alert-title', { count: validationErrors.length })}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}
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
        <FormHeader step={t('step')} title={t('title')} />

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
              onChange={handleUpload}
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

          <Form action={formAction} onSubmit={handleSubmit}>
            <SubmitButton>{t('submit-button')}</SubmitButton>
          </Form>
        </Column>
      </main>
    </>
  )
}
