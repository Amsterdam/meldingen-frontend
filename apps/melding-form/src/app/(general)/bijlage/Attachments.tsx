'use client'

import { ErrorMessage, Paragraph } from '@amsterdam/design-system-react'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from '@meldingen/api-client'
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

type UploadFile = {
  id: string
  file: File
  serverId?: number
  status: string // 'pending' | 'uploading' | 'success' | 'error'
  progress: number // 0-100
  error?: string
}

const initialState: Pick<FormState, 'systemError'> = {}

const startUpload = (
  uploadFile: UploadFile,
  setFiles: Dispatch<SetStateAction<UploadFile[]>>,
  meldingId: number,
  token: string,
) => {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', `http://localhost:8000/melding/${meldingId}/attachment?token=${encodeURIComponent(token)}`)

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === uploadFile.id ? { ...file, progress: (event.loaded / event.total) * 100 } : file,
        ),
      )
    }
  }

  xhr.onload = () => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === uploadFile.id
          ? {
              ...file,
              serverId: JSON.parse(xhr.response).id,
              status: xhr.status === 200 ? 'success' : 'error',
              error: xhr.status !== 200 ? 'Upload failed' : undefined,
            }
          : file,
      ),
    )
  }

  xhr.onerror = () => {
    setFiles((prev) =>
      prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'error', error: 'Network error' } : file)),
    )
  }

  setFiles((prev) => prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'uploading' } : file)))

  const formData = new FormData()
  formData.append('file', uploadFile.file)
  xhr.send(formData)
}

export const Attachments = ({ formData, meldingId, token }: Props) => {
  const [files, setFiles] = useState<UploadFile[]>([])

  const [errorMessage, setErrorMessage] = useState<string>()
  const [{ systemError }, formAction] = useActionState(submitAttachmentsForm, initialState)

  const t = useTranslations('attachments')

  const { label, description } = formData[0]

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)

    if (!event.currentTarget.files) return

    const newFiles = Array.from(event.currentTarget.files)

    // TODO: should files.length be the length of successfully uploaded files?
    if (newFiles.length + files.length > MAX_FILES) {
      setErrorMessage(t('errors.too-many-files', { maxFiles: MAX_FILES }))
      return
    }

    const uploadFiles = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...uploadFiles])

    uploadFiles.forEach((file) => startUpload(file, setFiles, meldingId, token))
  }

  const removeFile = async (serverId: number) => {
    setErrorMessage(undefined)

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

    setFiles((files) => files.filter((file) => file.serverId !== serverId))
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
            {t('status', { fileCount: files.filter((file) => file.status === 'success').length, maxFiles: MAX_FILES })}
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

          {files.length > 0 && (
            <FileList>
              {files.map((file) => (
                <FileList.Item
                  key={file.id}
                  file={file.file}
                  errorMessage={file.status === 'error' ? file.error : undefined}
                  onDelete={() => file.serverId && removeFile(file.serverId)}
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
