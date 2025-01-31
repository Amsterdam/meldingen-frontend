'use client'

import { Button, Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import { Grid } from '@meldingen/ui'
import NextLink from 'next/link'

const Bedankt = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading className="ams-mb--xs">Bedankt</Heading>
      <Paragraph>Bedankt voor uw melding.</Paragraph>
      <Paragraph>Wij hebben uw melding ontvangen op 21-11-2023 om 17:11. Uw meldnummer is 1977916.</Paragraph>
    </Grid.Cell>

    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading level={2} size="level-3" className="ams-mb--xs">
        Wat doen we met uw melding?
      </Heading>
      <Paragraph>Meldingen pakken we binnen 3 werkdagen op.</Paragraph>
    </Grid.Cell>

    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading level={3} size="level-3" className="ams-mb--xs">
        Vragen of meer informatie?
      </Heading>
      <Paragraph>
        Neem dan contact met ons op via{' '}
        <Link href="tel:+3114020" variant="inline">
          14 020
        </Link>
        . Vermeld hierbij alstublieft uw meldnummer. Meer informatie kunt u eventueel ook vinden op{' '}
        <Link href="www.amsterdam.nl" variant="inline">
          www.amsterdam.nl
        </Link>
        .
      </Paragraph>
    </Grid.Cell>

    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading level={4} size="level-3" className="ams-mb--xs">
        Wilt u nog een andere melding doen?
      </Heading>
      <NextLink href="/locatie">
        <Button>Doe een melding</Button>
      </NextLink>
    </Grid.Cell>
  </Grid>
)

export default Bedankt
