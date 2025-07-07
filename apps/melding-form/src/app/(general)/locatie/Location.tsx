'use client'

import { Alert, Heading, Paragraph, StandaloneLink } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { SubmitButton } from '@meldingen/ui'

import { postLocationForm } from './actions'
import type { Coordinates } from 'apps/melding-form/src/types'

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
    <>
      {formState?.message && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{formState.message}</Paragraph>
        </Alert>
      )}

      <Heading className="ams-mb-s" level={1}>
        {t('step.title')}
      </Heading>

      <Heading level={2} size="level-4">
        {t('title')}
      </Heading>
      <Paragraph className="ams-mb-xs">{locationData?.name ?? t('description')}</Paragraph>

      <NextLink href="/locatie/kies" legacyBehavior passHref>
        <StandaloneLink className="ams-mb-m">
          {locationData?.name ? t('link.with-location') : t('link.without-location')}
        </StandaloneLink>
      </NextLink>

      <form action={formAction}>
        <input
          type="hidden"
          name="coordinates"
          value={locationData?.coordinates ? JSON.stringify(locationData?.coordinates) : undefined}
        />
        <SubmitButton>{t('submit-button')}</SubmitButton>
      </form>
    </>
  )
}
