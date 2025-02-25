'use client'

import { Column, ErrorMessage, Field, Heading, Label, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import type { ApiError, AttachmentOutput } from '@meldingen/api-client'
import { Grid, SubmitButton } from '@meldingen/ui'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { postMeldingByMeldingIdAttachment } from 'apps/public/src/apiClientProxy'

import { BackLink } from '../_components/BackLink'

import { FileInput } from './_components/FileInput'
import { FileList } from './_components/FileList'
import { redirectToNextPage } from './actions'

const MAX_FILES = 3

type Props = {
  meldingId: number
  token: string
}

export type UploadedFiles = AttachmentOutput & { image: string }

export const Attachments = ({ meldingId, token }: Props) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)

    if (!event.currentTarget.files) return

    const files = Array.from(event.currentTarget.files)

    if (files.length > MAX_FILES) {
      setErrorMessage(`Je kunt maximaal ${MAX_FILES} bestanden uploaden.`)
      return
    }

    try {
      const result = await Promise.all(
        files.map(async (file) => {
          const uploadedFile = await postMeldingByMeldingIdAttachment({
            formData: { file },
            meldingId,
            token,
          })

          const image = URL.createObjectURL(file)

          return { ...uploadedFile, image }
        }),
      )
      setUploadedFiles((currentFiles) => [...currentFiles, ...result])
    } catch (error) {
      setErrorMessage((error as ApiError).message)
    }
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/locatie">Vorige vraag</BackLink>
        <Heading className="ams-mb--sm">Foto’s</Heading>
        <form action={redirectToNextPage}>
          <Field invalid={Boolean(errorMessage)} className="ams-mb--sm">
            <Label htmlFor="file-upload" optional>
              Heeft u een foto om toe te voegen?
            </Label>

            <Column id="file-upload-description" className="ams-mb--sm">
              <Paragraph>
                Voeg een foto toe om de situatie te verduidelijken. Verwijder alle persoonsgegevens van u en derden.
              </Paragraph>
              <UnorderedList>
                <UnorderedList.Item>U kunt maximaal drie bestanden tegelijk toevoegen.</UnorderedList.Item>
                <UnorderedList.Item>Toegestane bestandtypes: jpg, jpeg en png.</UnorderedList.Item>
                <UnorderedList.Item>Een bestand mag maximaal 20 MB groot zijn.</UnorderedList.Item>
              </UnorderedList>
            </Column>

            {errorMessage && <ErrorMessage id="error-message">{errorMessage}</ErrorMessage>}

            <FileInput handleOnChange={handleOnChange} id="file-upload" />

            {uploadedFiles.length > 0 && (
              <FileList
                meldingId={meldingId}
                setErrorMessage={setErrorMessage}
                setUploadedFiles={setUploadedFiles}
                token={token}
                uploadedFiles={uploadedFiles}
              />
            )}
          </Field>
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
