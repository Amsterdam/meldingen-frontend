'use client'

import { ErrorMessage, Paragraph } from '@amsterdam/design-system-react'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  deleteMeldingByMeldingIdAttachmentByAttachmentId,
  postMeldingByMeldingIdAttachment,
} from '@meldingen/api-client'
import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column, FileList, FileUpload, Heading, SubmitButton } from '@meldingen/ui'

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
            {errorMessage && <ErrorMessage id="error-message">{errorMessage}</ErrorMessage>}
          </Column>

          <Paragraph aria-live="polite">
            {t('status', { fileCount: uploadedFiles.length, maxFiles: MAX_FILES })}
          </Paragraph>

          <FileUpload
            accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround"
            aria-describedby={
              description || errorMessage
                ? `${description ? 'file-upload-description' : ''} ${errorMessage ? 'error-message' : ''}`
                : undefined
            }
            aria-labelledby="file-upload-label file-upload"
            buttonText={t('file-upload.button')}
            dropAreaText={t('file-upload.drop-area')}
            id="file-upload"
            multiple
            onChange={handleChange}
          />

          {uploadedFiles.length > 0 && (
            <FileList>
              {uploadedFiles.map((attachment) => (
                <FileList.Item key={attachment.id} file={attachment.file} onDelete={() => removeFile(attachment.id)} />
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
