'use client'

import { Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import { Grid } from '@meldingen/ui'
import NextLink from 'next/link'

type Props = {
  meldingId: string
}

export const Bedankt = ({ meldingId }: Props) => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading className="ams-mb--xs">Bedankt</Heading>
      <Paragraph>Bedankt voor uw melding.</Paragraph>
      <Paragraph className="ams-mb--sm">{`Wij hebben uw melding ontvangen op 21-11-2023 om 17:11. Uw meldnummer is ${meldingId}.`}</Paragraph>

      <Heading level={2} size="level-3" className="ams-mb--xs">
        Wat doen we met uw melding?
      </Heading>
      <Paragraph className="ams-mb--sm">Meldingen pakken we binnen 3 werkdagen op.</Paragraph>

      <Heading level={2} size="level-3" className="ams-mb--xs">
        Vragen of meer informatie?
      </Heading>
      <Paragraph className="ams-mb--sm">
        Neem dan contact met ons op via{' '}
        <Link href="tel:14020" variant="inline">
          14 020
        </Link>
        . Vermeld hierbij alstublieft uw meldnummer. Meer informatie kunt u eventueel ook vinden op{' '}
        <Link href="https://www.amsterdam.nl/" variant="inline" target="_blank">
          www.amsterdam.nl
        </Link>
        .
      </Paragraph>

      <Heading level={2} size="level-3" className="ams-mb--xs">
        Wilt u nog een andere melding doen?
      </Heading>
      <NextLink href="/locatie" legacyBehavior passHref>
        <Link href="dummy-href">Doe een melding</Link>
      </NextLink>
    </Grid.Cell>
  </Grid>
)
