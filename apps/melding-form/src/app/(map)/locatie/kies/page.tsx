import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { getMeldingByMeldingIdMelder } from '@meldingen/api-client'

import { SelectLocation } from './SelectLocation'
import { COOKIES } from 'apps/melding-form/src/constants'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our middleware, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const { data, error } = await getMeldingByMeldingIdMelder({
    path: {
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch melding data.')

  const coordinates = data.geo_location?.geometry?.coordinates && {
    lat: data.geo_location.geometry.coordinates[0],
    lng: data.geo_location.geometry.coordinates[1],
  }

  return <SelectLocation classification={data.classification?.name} coordinates={coordinates} />
}
