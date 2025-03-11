'use client'

import { Alert, Heading, Label, Paragraph, TextInput } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'

import { BackLink } from '../_components/BackLink'

import { postContactForm } from './actions'

const initialState: { message?: string } = {}

export const Contact = ({ formData }: { formData: StaticFormTextAreaComponentOutput[] }) => {
  const [formState, formAction] = useActionState(postContactForm, initialState)

  const emailLabel = formData[0].label
  const emailDescription = formData[0].description
  const telLabel = formData[1].label
  const telDescription = formData[1].description

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/bijlage" className="ams-mb--xs">
          Vorige vraag
        </BackLink>
        <Heading level={1} className="ams-mb--sm">
          Gegevens
        </Heading>
        <Heading level={2} size="level-4" className="ams-mb--xs">
          Mogen we u bellen voor vragen? En op de hoogte houden via e-mail?
        </Heading>
        <Paragraph className="ams-mb--xs">
          Vaak hebben we nog een vraag. Daarmee kunnen we het probleem sneller of beter oplossen. Of we willen iets
          uitleggen. Wij willen u dan graag even bellen. Of anders e-mailen wij u.
        </Paragraph>
        <Paragraph className="ams-mb--sm">
          Wij gebruiken uw telefoonnummer en e-mailadres alléén voor deze melding.
        </Paragraph>
        <form action={formAction}>
          {formState?.message && (
            <Alert severity="error" heading="Let op" className="ams-mb--sm">
              <Paragraph>{formState?.message}</Paragraph>
            </Alert>
          )}
          <Label htmlFor="email-input" optional className="ams-mb--sm">
            {emailLabel}
          </Label>
          {emailDescription && (
            <Paragraph size="small" id="email-input-description">
              {emailDescription}
            </Paragraph>
          )}
          <TextInput
            aria-describedby={emailDescription ? 'email-input-description' : undefined}
            name="email"
            id="email-input"
            type="email"
            autoComplete="email"
            autoCorrect="off"
            spellCheck="false"
            className="ams-mb--sm"
          />
          <Label htmlFor="tel-input" optional className="ams-mb--sm">
            {telLabel}
          </Label>
          {telDescription && (
            <Paragraph size="small" id="tel-input-description">
              {telDescription}
            </Paragraph>
          )}
          <TextInput
            aria-describedby={telDescription ? 'tel-input-description' : undefined}
            autoComplete="tel"
            className="ams-mb--sm"
            id="tel-input"
            name="phone"
            type="tel"
          />
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
