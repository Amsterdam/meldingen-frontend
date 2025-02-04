'use client'

import { Button, Heading, Paragraph } from '@amsterdam/design-system-react'
import { Grid } from '@meldingen/ui'

export const Samenvatting = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading>Samenvatting</Heading>

      <Heading size="level-3">Versturen</Heading>
      <Paragraph>Controleer uw gegevens en verstuur uw melding.</Paragraph>

      {/* Melding text */}
      <Heading size="level-3">Wat wilt u melden?</Heading>
      <Paragraph>
        Gister is het afval niet allemaal meegenomen door de vuilniswagen, hierdoor is het nu een grote bende. Er ligt
        van alles , karton, plastic etc.
      </Paragraph>

      {/* Aanvullende vragen */}
      <Heading size="level-3">Aanvullende vragen</Heading>

      {/* Bijlagen */}
      <Heading size="level-3">Bijlagen</Heading>

      {/* Locatie */}
      <Heading size="level-3">Waar is het?</Heading>
      <Paragraph>Weesperstraat 113, 1018 VN Amsterdam</Paragraph>

      {/* Contact gegevens */}
      <Heading size="level-3">Wat zijn uw contactgegevens?</Heading>
      <Paragraph>mailadres@gmail.com</Paragraph>
      <Paragraph>0612345678</Paragraph>

      <Button>Verstuur Melding</Button>
    </Grid.Cell>
  </Grid>
)
