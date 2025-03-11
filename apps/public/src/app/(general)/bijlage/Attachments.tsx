'use client'

import { ErrorMessage, Field, FileList, Heading, Label } from '@amsterdam/design-system-react'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Grid, FileInput, SubmitButton } from '@meldingen/ui'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import type { ApiError, StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'
import {
  deleteMeldingByMeldingIdAttachmentByAttachmentId,
  postMeldingByMeldingIdAttachment,
} from 'apps/public/src/apiClientProxy'

import { BackLink } from '../_components/BackLink'

import { redirectToNextPage } from './actions'
import styles from './Attachments.module.css'

const MAX_FILES = 3

type Props = {
  formData: StaticFormTextAreaComponentOutput[]
  meldingId: number
  token: string
}

export type UploadedFiles = { file: File; id: number }

export const Attachments = ({ formData, meldingId, token }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()

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
          const uploadedFile = await postMeldingByMeldingIdAttachment({
            formData: { file },
            meldingId,
            token,
          })

          return { file, id: uploadedFile.id }
        }),
      )
      setUploadedFiles((currentFiles) => [...currentFiles, ...result])
    } catch (error) {
      setErrorMessage((error as ApiError).message)
    }
    // A file input in a form by default sends the files to the Next backend on submit.
    // We do not want to do this since we're sending them directly from the client.
    formRef.current?.reset()
  }

  const removeFile = async (attachmentId: number) => {
    setErrorMessage(undefined)

    try {
      await deleteMeldingByMeldingIdAttachmentByAttachmentId({
        meldingId,
        attachmentId,
        token,
      })
      setUploadedFiles((files) => files.filter((file) => file.id !== attachmentId))
    } catch (error) {
      setErrorMessage((error as ApiError).message)
    }
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/locatie">{t('back-link')}</BackLink>
        <Heading className="ams-mb--sm">{t('step.title')}</Heading>
        <form ref={formRef} action={redirectToNextPage}>
          <Field invalid={Boolean(errorMessage)} className="ams-mb--sm">
            <Label htmlFor="file-upload" optional>
              {label}
            </Label>
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
        </form>
      </Grid.Cell>
    </Grid>
  )
}
