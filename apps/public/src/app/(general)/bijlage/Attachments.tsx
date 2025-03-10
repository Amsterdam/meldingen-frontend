'use client'

import {
  Column,
  ErrorMessage,
  Field,
  FileList,
  Heading,
  Label,
  Paragraph,
  UnorderedList,
} from '@amsterdam/design-system-react'
import type { ApiError } from '@meldingen/api-client'
import { Grid, FileInput, SubmitButton } from '@meldingen/ui'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  deleteMeldingByMeldingIdAttachmentByAttachmentId,
  postMeldingByMeldingIdAttachment,
} from 'apps/public/src/apiClientProxy'

import { BackLink } from '../_components/BackLink'

import { redirectToNextPage } from './actions'
import styles from './Attachments.module.css'

const MAX_FILES = 3

type Props = {
  meldingId: number
  token: string
}

export type UploadedFiles = { file: File; id: number }

export const Attachments = ({ meldingId, token }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()

  const t = useTranslations('attachments')

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
              Heeft u een foto om toe te voegen?
            </Label>

            <Column id="file-upload-description" className="ams-mb--sm">
              <Paragraph>
                Voeg een foto toe om de situatie te verduidelijken. Verwijder alle persoonsgegevens van u en derden.
              </Paragraph>
              <UnorderedList>
                <UnorderedList.Item>U kunt maximaal 3 bestanden tegelijk toevoegen.</UnorderedList.Item>
                <UnorderedList.Item>Toegestane bestandtypes: jpg, jpeg en png.</UnorderedList.Item>
                <UnorderedList.Item>Een bestand mag maximaal 20 MB groot zijn.</UnorderedList.Item>
              </UnorderedList>
            </Column>

            {errorMessage && <ErrorMessage id="error-message">{errorMessage}</ErrorMessage>}

            <FileInput
              accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround"
              aria-describedby={`file-upload-description ${errorMessage ? 'error-message' : ''}`}
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
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
