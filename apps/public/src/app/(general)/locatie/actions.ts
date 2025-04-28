'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { postMeldingByMeldingIdLocation, putMeldingByMeldingIdSubmitLocation } from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'

export const postLocationForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const coordinates = formData.get('coordinates')

  const t = await getTranslations('location')

  if (!coordinates) return { message: t('errors.no-location') }

  const parsedCoordinates = JSON.parse(coordinates as string)

  const { error } = await postMeldingByMeldingIdLocation({
    body: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [parsedCoordinates.lat, parsedCoordinates.lng] },
      properties: {},
    },
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  // Set melding state to 'location_submitted'
  const { error: stateError } = await putMeldingByMeldingIdSubmitLocation({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error || stateError) return { message: handleApiError(error || stateError) }

  return redirect('/bijlage')
}
