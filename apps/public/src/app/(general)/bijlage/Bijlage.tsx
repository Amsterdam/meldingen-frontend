'use client'

import { Column, Field, Heading, Label, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import type { AttachmentOutput } from '@meldingen/api-client'
import { Grid, SubmitButton } from '@meldingen/ui'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { postMeldingByMeldingIdAttachment } from 'apps/public/src/apiClientProxy'

import { BackLink } from '../_components/BackLink'

import { FileUpload } from './_components/FileUpload'
import { redirectToNextPage } from './actions'

type Props = {
  meldingId: number
  token: string
}

export type UploadedFiles = AttachmentOutput & { image: string }

export const Bijlage = ({ meldingId, token }: Props) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return

    const files = Array.from(event.currentTarget.files)

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
      setErrorMessage((error as Error).message)
    }
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/locatie">Vorige vraag</BackLink>
        <Heading className="ams-mb--sm">Foto’s</Heading>
        {errorMessage && <Paragraph>{errorMessage}</Paragraph>}
        <form action={redirectToNextPage}>
          <Field>
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
            <FileUpload
              aria-describedby="file-upload-description"
              handleOnChange={handleOnChange}
              id="file-upload"
              meldingId={meldingId}
              setUploadedFiles={setUploadedFiles}
              token={token}
              uploadedFiles={uploadedFiles}
            />
          </Field>
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
