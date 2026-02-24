'use server'

import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { patchMeldingByMeldingIdLocation, postMeldingByMeldingIdAsset } from '@meldingen/api-client'

import type { Coordinates } from 'apps/melding-form/src/types'

import { convertWktPointToCoordinates } from './utils'
import { COOKIES } from 'apps/melding-form/src/constants'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam&rows=1'

const safeJsonParse = <T>(value: unknown, fallback: T): T => {
  if (!value || typeof value !== 'string') return fallback

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const postCoordinatesAndAssets = async (_: unknown, formData: FormData) => {
  const selectedAssetsRaw = formData.get('selectedAssets')
  const selectedAssets = safeJsonParse<number[]>(selectedAssetsRaw, [])
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const addressFormData = formData.get('address')
  const coordinatesFormData = formData.get('coordinates')
  const t = await getTranslations('select-location')

  /** Post assets */

  if (selectedAssets.length > 0) {
    for (const assetId of selectedAssets) {
      const { error } = await postMeldingByMeldingIdAsset({
        body: {
          asset_type_id: 1,
          external_id: String(assetId),
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

  let address = addressFormData as string
  let coordinates: Coordinates | null = safeJsonParse(coordinatesFormData, null)

  if (!address) {
    return { errorMessage: t('errors.no-location') }
  }

  if (!coordinates) {
    const response = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`)

    if (!response.ok) return { errorMessage: t('errors.pdok-failed') }

    const result = await response.json()

    if (!result.response.docs.length) return { errorMessage: t('errors.pdok-no-address-found') }

    const PDOKCoordinates = convertWktPointToCoordinates(result.response.docs[0].centroide_ll)

    if (!PDOKCoordinates) return { errorMessage: t('errors.pdok-failed') }

    coordinates = PDOKCoordinates
    address = result.response.docs[0].weergavenaam
  }

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
