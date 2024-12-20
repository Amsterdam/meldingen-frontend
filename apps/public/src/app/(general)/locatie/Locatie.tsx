'use client'

import { Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import NextLink from 'next/link'

import { BackLink } from '../_components/BackLink'

import { postLocationForm } from './actions'

export const Locatie = ({ prevPage }: { prevPage: string }) => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <BackLink href={prevPage}>Vorige vraag</BackLink>
      <Heading className="ams-mb--sm">Locatie</Heading>

      {/* TODO: text should come from api */}
      <Heading level={2} size="level-4">
        Waar staat de container?
      </Heading>
      <Paragraph className="ams-mb--xs">
        In het volgende scherm kunt u op de kaart een adres of container opzoeken.
      </Paragraph>

      <NextLink href="/locatie/kies" legacyBehavior passHref>
        <Link variant="standalone" href="dummy-href" className="ams-mb--md">
          Selecteer de locatie
        </Link>
      </NextLink>
      <form action={postLocationForm}>
        <input type="hidden" />
        <SubmitButton>Volgende vraag</SubmitButton>
      </form>
    </Grid.Cell>
  </Grid>
)
