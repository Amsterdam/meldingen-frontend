'use client'

import { Column, Field, Heading, Label, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import type { AttachmentOutput } from '@meldingen/api-client'
import { Grid, SubmitButton } from '@meldingen/ui'
import { useState } from 'react'

import { BackLink } from '../_components/BackLink'

import { FileUpload } from './_components/FileUpload'
import { postAttachmentForm, redirectToNextPage } from './actions'

export const Bijlage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<AttachmentOutput[]>([])

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return

    const results = await postAttachmentForm(event.currentTarget.files)

    if (results) setUploadedFiles((currentFiles) => [...currentFiles, ...results])
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <BackLink href="/locatie">Vorige vraag</BackLink>
        <Heading className="ams-mb--sm">Foto’s</Heading>
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
