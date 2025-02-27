'use client'

import { Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import NextLink from 'next/link'
import { useActionState } from 'react'

import type { Coordinates } from 'apps/public/src/types'

import { BackLink } from '../_components/BackLink'

import { postLocationForm } from './actions'

const initialState: { message?: string } = {}

type Props = {
  prevPage: string
  locationData?: {
    name: string
    coordinates?: Coordinates
  }
}

export const Location = ({ prevPage, locationData }: Props) => {
  const [formState, formAction] = useActionState(postLocationForm, initialState)

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href={prevPage} className="ams-mb--xs">
          Vorige vraag
        </BackLink>
        <Heading className="ams-mb--sm">Locatie</Heading>

        {formState?.message && <Paragraph>{formState.message}</Paragraph>}

        {/* TODO: text should come from api */}
        <Heading level={2} size="level-4">
          Waar staat de container?
        </Heading>
        <Paragraph className="ams-mb--xs">
          {locationData?.name ?? 'In het volgende scherm kunt u op de kaart een adres of container opzoeken.'}
        </Paragraph>

        <NextLink href="/locatie/kies" legacyBehavior passHref>
          <Link variant="standalone" href="dummy-href" className="ams-mb--md">
            {locationData?.name ? 'Wijzig locatie' : 'Selecteer de locatie'}
          </Link>
        </NextLink>

        <form action={formAction}>
          <input
            type="hidden"
            name="coordinates"
            value={locationData?.coordinates ? JSON.stringify(locationData?.coordinates) : undefined}
          />
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
