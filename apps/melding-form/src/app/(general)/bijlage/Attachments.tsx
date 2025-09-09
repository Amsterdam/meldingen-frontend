'use client'

import { ErrorMessage, Field, FileList, Label } from '@amsterdam/design-system-react'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  deleteMeldingByMeldingIdAttachmentByAttachmentId,
  postMeldingByMeldingIdAttachment,
} from '@meldingen/api-client'
import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FileInput, SubmitButton } from '@meldingen/ui'

import { submitAttachmentsForm } from './actions'
import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { handleApiError } from 'apps/melding-form/src/handleApiError'
import { FormState } from 'apps/melding-form/src/types'

import styles from './Attachments.module.css'

const MAX_FILES = 3

type Props = {
  formData: StaticFormTextAreaComponentOutput[]
  meldingId: number
  token: string
}

export type UploadedFiles = { file: File; id: number }

const initialState: Pick<FormState, 'systemError'> = {}

export const Attachments = ({ formData, meldingId, token }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()
  const [{ systemError }, formAction] = useActionState(submitAttachmentsForm, initialState)

  const t = useTranslations('attachments')

  const { label, description } = formData[0]

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)

    if (!event.currentTarget.files) return

    const files = Array.from(event.currentTarget.files)

    try {
      if (files.length + uploadedFiles.length > MAX_FILES) {
        throw new Error(t('errors.too-many-files', { maxFiles: MAX_FILES }))
      }

      const result = await Promise.all(
        files.map(async (file) => {
          const { data, error } = await postMeldingByMeldingIdAttachment({
            body: { file },
            path: { melding_id: meldingId },
            query: { token },
          })

          if (error || !data?.id) {
            throw new Error('Failed to upload file')
          }

          return { file, id: data.id }
        }),
      )
      setUploadedFiles((currentFiles) => [...currentFiles, ...result])
    } catch (error) {
      setErrorMessage((error as Error).message)
    }
    // A file input in a form by default sends the files to the Next backend on submit.
    // We do not want to do this since we're sending them directly from the client.
    formRef.current?.reset()
  }

  const removeFile = async (attachmentId: number) => {
    setErrorMessage(undefined)

    const { error } = await deleteMeldingByMeldingIdAttachmentByAttachmentId({
      path: {
        attachment_id: attachmentId,
        melding_id: meldingId,
      },
      query: { token },
    })

    if (error) {
      setErrorMessage(handleApiError(error))
      return
    }

    setUploadedFiles((files) => files.filter((file) => file.id !== attachmentId))
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
        <Form action={formAction} noValidate ref={formRef}>
          <Field invalid={Boolean(errorMessage)} className="ams-mb-m">
            <h1 className={styles.h1}>
              <Label htmlFor="file-upload" optional>
                {label}
              </Label>
            </h1>
            {description && (
              <MarkdownToHtml id="file-upload-description" type="description">
                {description}
              </MarkdownToHtml>
            )}

            {errorMessage && <ErrorMessage id="error-message">{errorMessage}</ErrorMessage>}

            <FileInput
              accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround"
              aria-describedby={
                description || errorMessage
                  ? `${description ? 'file-upload-description' : ''} ${errorMessage ? 'error-message' : ''}`
                  : undefined
              }
              buttonText={t('file-input.button')}
              dropAreaText={t('file-input.drop-area')}
              id="file-upload"
              name="file"
              multiple
              onChange={handleChange}
            />

            {uploadedFiles.length > 0 && (
              <FileList className={styles.fileList}>
                {uploadedFiles.map((attachment) => (
                  <FileList.Item
                    key={attachment.id}
                    file={attachment.file}
                    onDelete={() => removeFile(attachment.id)}
                  />
                ))}
              </FileList>
            )}
          </Field>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
