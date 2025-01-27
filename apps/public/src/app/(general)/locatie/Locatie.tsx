'use client'

import { Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import NextLink from 'next/link'
import { useActionState } from 'react'

import { BackLink } from '../_components/BackLink'

import { postLocationForm } from './actions'

const initialState: { message?: string } = {}

export const Locatie = ({ prevPage, locationData }: { prevPage: string; locationData: any }) => {
  const [formState, formAction] = useActionState(postLocationForm, initialState)

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <BackLink href={prevPage}>Vorige vraag</BackLink>
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
            name="coordinate"
            value={locationData?.coordinate ? JSON.stringify(locationData.coordinate) : ''}
          />
          <SubmitButton>Volgende vraag</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
