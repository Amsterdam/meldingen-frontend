'use server'

import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { Feature } from '@meldingen/api-client'

import { patchMeldingByMeldingIdLocation, postMeldingByMeldingIdAsset } from '@meldingen/api-client'

import { convertWktPointToCoordinates } from './utils'
import { COOKIES } from 'apps/melding-form/src/constants'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam&rows=1'

export const postCoordinatesAndAssets = async (
  { selectedAssets }: { selectedAssets: Feature[] },
  _: unknown,
  formData: FormData,
) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const addressCookie = formData.get('address')
  const coordinatesCookie = formData.get('coordinates')
  const t = await getTranslations('select-location')

  /** Post assets */

  if (selectedAssets.length > 0) {
    for (const asset of selectedAssets) {
      const { error } = await postMeldingByMeldingIdAsset({
        body: {
          asset_type_id: 1,
          external_id: String(asset.id),
        },
        path: { melding_id: parseInt(meldingId, 10) },
        query: { token },
      })

      if (error) {
        return { errorMessage: handleApiError(error) }
      }
    }
  }

  /** Fetch coordinates from PDOK */

  let coordinates = null
  let address = ''

  if (!addressCookie) {
    return { errorMessage: t('errors.no-location') }
  }

  // If the user pins the location on the map without a valid address, use the coordinates directly
  if (addressCookie === t('combo-box.no-address')) {
    coordinates = JSON.parse(coordinatesCookie as string)
    address = addressCookie
  } else {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${addressCookie}&${queryParams}`,
    )

    if (!response.ok) return { errorMessage: t('errors.pdok-failed') }

    const result = await response.json()

    if (!result.response.docs.length) return { errorMessage: t('errors.pdok-no-address-found') }

    const PDOKCoordinates = convertWktPointToCoordinates(result.response.docs[0].centroide_ll)

    coordinates = PDOKCoordinates
    address = result.response.docs[0].weergavenaam
  }

  if (!coordinates) return { errorMessage: 'No coordinates found' }
  /** Post coordinates and address */

  const oneDay = 24 * 60 * 60
  cookieStore.set(COOKIES.ADDRESS, address, { maxAge: oneDay })

  const { error } = await patchMeldingByMeldingIdLocation({
    body: {
      geometry: { coordinates: [coordinates.lat, coordinates.lng], type: 'Point' },
      properties: {},
      type: 'Feature',
    },
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) {
    return { errorMessage: handleApiError(error) }
  }

  return redirect('/locatie')
}
