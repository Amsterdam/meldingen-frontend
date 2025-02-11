'use client'

import { Alert, Heading, Label, Paragraph, TextInput } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import { useActionState } from 'react'

import { BackLink } from '../_components/BackLink'

import { postContactForm } from './actions'

const initialState: { message?: string } = {}

export const Contact = () => {
  const [formState, formAction] = useActionState(postContactForm, initialState)

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <BackLink href="/bijlage">Vorige vraag</BackLink>
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
            Wat is uw e-mailadres?
          </Label>
          <TextInput
            name="email"
            id="email-input"
            type="email"
            autoComplete="email"
            autoCorrect="off"
            spellCheck="false"
            className="ams-mb--sm"
          />
          <Label htmlFor="tel-input" optional className="ams-mb--sm">
            Wat is uw telefoonnummer?
          </Label>
          <TextInput name="phone" id="tel-input" type="tel" autoComplete="tel" className="ams-mb--sm" />
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
