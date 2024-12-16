'use client'

import { Column, Field, Heading, Label, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, type FormEvent } from 'react'

import { BackLink } from '../_components/BackLink'

import { FileUpload } from './_components/FileUpload'

const Form = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const meldingId = searchParams?.get('id')
  const token = searchParams?.get('token')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    router.push(`/bedankt`)
  }

  return (
    <>
      <BackLink href={`/locatie?token=${token}&id=${meldingId}`}>Vorige vraag</BackLink>
      <Heading className="ams-mb--sm">Foto’s</Heading>
      <form onSubmit={handleSubmit}>
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
          <FileUpload id="file-upload" aria-describedby="file-upload-description" />
        </Field>
        <SubmitButton>Volgende vraag</SubmitButton>
      </form>
    </>
  )
}

const Bijlagen = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Suspense>
        <Form />
      </Suspense>
    </Grid.Cell>
  </Grid>
)

export default Bijlagen
