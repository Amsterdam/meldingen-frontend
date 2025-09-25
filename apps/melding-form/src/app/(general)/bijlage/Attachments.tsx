'use client'

import { ErrorMessage, Paragraph } from '@amsterdam/design-system-react'
import { getAriaDescribedBy } from 'libs/form-renderer/src/utils'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from '@meldingen/api-client'
import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column, FileList, FileUpload, Heading, SubmitButton } from '@meldingen/ui'

import { submitAttachmentsForm } from './actions'
import type { FileUpload as FileUploadType } from './utils'
import { startUpload } from './utils'
import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { handleApiError } from 'apps/melding-form/src/handleApiError'
import type { FormState } from 'apps/melding-form/src/types'

import styles from './Attachments.module.css'

const MAX_FILES = 3

type Props = {
  formData: StaticFormTextAreaComponentOutput[]
  meldingId: number
  token: string
}

const initialState: Pick<FormState, 'systemError'> = {}

const createFileUploads = (newFiles: File[]): FileUploadType[] =>
  newFiles.map((file) => ({
    file,
    id: crypto.randomUUID(),
    progress: 0,
    status: 'pending',
    xhr: new XMLHttpRequest(),
  }))

export const Attachments = ({ formData, meldingId, token }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [fileUploads, setFileUploads] = useState<FileUploadType[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()

  const [{ systemError }, formAction] = useActionState(submitAttachmentsForm, initialState)

  const t = useTranslations('attachments')

  const { label, description } = formData[0]

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)

    if (!event.currentTarget.files) return

    const newFiles = Array.from(event.currentTarget.files)

    // TODO: should fileUploads.length be the length of successfully uploaded files?
    if (newFiles.length + fileUploads.length > MAX_FILES) {
      setErrorMessage(t('errors.too-many-files', { maxFiles: MAX_FILES }))
      return
    }

    const newFileUploads = createFileUploads(newFiles)

    setFileUploads((prev) => [...prev, ...newFileUploads])

    newFileUploads.forEach((upload) => {
      const xhr = upload.xhr
      xhr.open('POST', `http://localhost:8000/melding/${meldingId}/attachment?token=${encodeURIComponent(token)}`)

      startUpload(xhr, upload, setFileUploads)
    })

    // Clear the file input after starting the upload, so it is empty for the next selection.
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string, xhr: XMLHttpRequest, serverId?: number) => {
    setErrorMessage(undefined)

    // Abort upload if in progress
    if (xhr.readyState !== XMLHttpRequest.DONE) {
      xhr.abort()
      setFileUploads((fileUploads) => fileUploads.filter((upload) => upload.id !== id))
      return
    }

    // If the file upload does not have a server id (because the server returned an error for example)
    // simply remove it from the list
    if (!serverId) {
      setFileUploads((fileUploads) => fileUploads.filter((upload) => upload.id !== id))
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
  }

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <>
      <BackLink className="ams-mb-s" href="/locatie">
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert />}
        <FormHeader title={t('title')} step={t('step')} />

        <Column>
          <Column gap="small">
            <Heading id="file-upload-label" level={1} size="level-4">
              {label} <span className={styles.hint}>{t('hint-text')}</span>
            </Heading>
            {description && (
              <MarkdownToHtml id="file-upload-description" type="description">
                {description}
              </MarkdownToHtml>
            )}
            {errorMessage && <ErrorMessage id="file-upload-error-message">{errorMessage}</ErrorMessage>}
          </Column>

          <Paragraph aria-live="polite">
            {t('status', {
              fileCount: fileUploads.filter((upload) => upload.status === 'success').length,
              maxFiles: MAX_FILES,
            })}
          </Paragraph>

          <FileUpload
            accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround"
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
              {fileUploads.map(({ error, file, id, serverId, status, xhr }) => (
                <FileList.Item
                  key={id}
                  file={file}
                  errorMessage={status === 'error' ? error : undefined}
                  onDelete={() => handleDelete(id, xhr, serverId)}
                />
              ))}
            </FileList>
          )}

          <Form action={formAction}>
            <SubmitButton>{t('submit-button')}</SubmitButton>
          </Form>
        </Column>
      </main>
    </>
  )
}
