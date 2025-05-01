'use client'

import { Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { Grid, SubmitButton } from '@meldingen/ui'

import { postLocationForm } from './actions'
// import { BackLink } from '../_components/BackLink'
import type { Coordinates } from 'apps/public/src/types'

const initialState: { message?: string } = {}

type Props = {
  prevPage: string
  locationData?: {
    name: string
    coordinates?: Coordinates
  }
}

export const Location = ({ locationData }: Props) => {
  const [formState, formAction] = useActionState(postLocationForm, initialState)

  const t = useTranslations('location')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <Heading className="ams-mb-s" level={1}>
          {t('step.title')}
        </Heading>

        {formState?.message && <Paragraph>{formState.message}</Paragraph>}

        <Heading level={2} size="level-4">
          {t('title')}
        </Heading>
        <Paragraph className="ams-mb-xs">{locationData?.name ?? t('description')}</Paragraph>

        <NextLink href="/locatie/kies" legacyBehavior passHref>
          <Link variant="standalone" href="dummy-href" className="ams-mb-m">
            {locationData?.name ? t('link.with-location') : t('link.without-location')}
          </Link>
        </NextLink>

        <form action={formAction}>
          <input
            type="hidden"
            name="coordinates"
            value={locationData?.coordinates ? JSON.stringify(locationData?.coordinates) : undefined}
          />
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
