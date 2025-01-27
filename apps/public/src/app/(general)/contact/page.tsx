'use client'

import { Column, Field, FieldSet, Heading, Label, Paragraph, TextInput } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import { BackLink } from '../_components/BackLink'

const Contact = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <BackLink href="/bijlage">Vorige vraag</BackLink>
      <Heading className="ams-mb--sm">Contact</Heading>
      <form>
        <FieldSet
          aria-labelledby="contact-details-description"
          legend="Mogen we u bellen voor vragen? En op de hoogte houden via e-mail?"
        >
          <Column id="contact-details-description" className="ams-mb--sm">
            <Paragraph>
              Vaak hebben we nog een vraag. Daarmee kunnen we het probleem sneller of beter oplossen. Of we willen iets
              uitleggen. Wij willen u dan graag even bellen. Of anders e-mailen wij u.
            </Paragraph>
            <Paragraph>Wij gebruiken uw telefoonnummer en e-mailadres alléén voor deze melding.</Paragraph>
          </Column>
          <Field className="ams-mb--sm">
            <Label htmlFor="email-input" optional>
              Wat is uw e-mailadres?
            </Label>
            <TextInput id="email-input" type="email" autoComplete="email" autoCorrect="off" spellCheck="false" />
          </Field>
          <Field className="ams-mb--sm">
            <Label htmlFor="tel-input" optional>
              Wat is uw telefoonnummer?
            </Label>
            <TextInput id="tel-input" type="tel" autoComplete="tel" />
          </Field>
        </FieldSet>
        <SubmitButton>Volgende vraag</SubmitButton>
      </form>
    </Grid.Cell>
  </Grid>
)

export default Contact
