'use client'

import { Column, Field, Heading, Label, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import type { AttachmentOutput } from 'apps/public/src/apiClientProxy'
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

export const Bijlage = ({ meldingId, token }: Props) => {
  const [uploadedFiles, setUploadedFiles] = useState<AttachmentOutput[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return

    const files = Array.from(event.currentTarget.files)

    try {
      const result = await Promise.all(
        files.map((file) =>
          postMeldingByMeldingIdAttachment({
            formData: { file },
            meldingId,
            token,
          }),
        ),
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
              id="file-upload"
              handleOnChange={handleOnChange}
              aria-describedby="file-upload-description"
              uploadedFiles={uploadedFiles}
            />
          </Field>
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
