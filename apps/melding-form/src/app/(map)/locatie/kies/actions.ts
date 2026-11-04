'use server'

import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { MeldingAssetInputV2 } from '@meldingen/api-client'

import {
  patchMeldingByMeldingIdLocation,
  putMeldingByMeldingIdAssets,
  putMeldingByMeldingIdSubmitLocation,
} from '@meldingen/api-client'
import { safeJSONParse } from '@meldingen/utils'

import type { Coordinates } from '~/types'

import { convertWktPointToCoordinates } from './_utils/convertWktPointToCoordinates'
import { COOKIES, SESSION_COOKIE_OPTIONS, TOP_ANCHOR_ID } from '~/constants'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam&rows=1'

type PDOKError = {
  cause: string
  translationKey: 'errors.pdok-failed' | 'errors.pdok-no-address-found'
}

type PDOKLocation = {
  address: string
  coordinates: Coordinates
}

const fetchPDOKLocation = async (address: string): Promise<PDOKLocation | { error: PDOKError }> => {
  const response = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`)

  if (!response.ok) {
    return {
      error: {
        cause: `PDOK request failed with status ${response.status}`,
        translationKey: 'errors.pdok-failed',
      },
    }
  }

  const result = await response.json()
  const location = result.response.docs[0]

  if (!location) {
    return {
      error: {
        cause: 'PDOK returned no results for the given address',
        translationKey: 'errors.pdok-no-address-found',
      },
    }
  }

  const coordinates = convertWktPointToCoordinates(location.centroide_ll)

  if (!coordinates) {
    return {
      error: {
        cause: 'Failed to convert PDOK point to coordinates',
        translationKey: 'errors.pdok-failed',
      },
    }
  }

  return { address: location.weergavenaam, coordinates }
}

const updateAssets = async ({
  asset_type_id,
  meldingId,
  selectedAssetsValue,
  token,
}: {
  asset_type_id?: number
  meldingId: number
  selectedAssetsValue: MeldingAssetInputV2[]
  token: string
}) => {
  if (selectedAssetsValue.length === 0 && !asset_type_id) return { error: null }

  if (!asset_type_id) {
    return { error: 'Missing asset_type_id for selected assets' }
  }

  const result = await putMeldingByMeldingIdAssets({
    body: { asset_type_id, assets: selectedAssetsValue },
    path: { melding_id: meldingId },
    query: { token },
  })

  if (result.error) {
    return { error: result.error.detail || result.error }
  }

  return { error: null }
}

export const postCoordinatesAndAssets = async (
  { asset_type_id }: { asset_type_id?: number },
  _: unknown,
  formData: FormData,
) => {
  const cookieStore = await cookies()

  const token = cookieStore.get(COOKIES.TOKEN)?.value
  const meldingIdString = cookieStore.get(COOKIES.ID)?.value

  if (!meldingIdString || !token) return redirect(`/cookie-storing#${TOP_ANCHOR_ID}`)

  const t = await getTranslations('select-location')

  const meldingId = parseInt(meldingIdString, 10)

  const addressFormData = formData.get('address')
  const coordinatesFormData = formData.get('coordinates')
  const selectedAssetsValueRaw = formData.get('selectedAssetsValue')

  const selectedAssetsValue = safeJSONParse<MeldingAssetInputV2[], MeldingAssetInputV2[]>(selectedAssetsValueRaw, [])

  /** Update assets */
  const assetsResult = await updateAssets({ asset_type_id, meldingId, selectedAssetsValue, token })

  if (assetsResult.error) {
    return { error: { cause: assetsResult.error, message: t('errors.assets-post-failed') } }
  }

  /** Fetch coordinates from PDOK */
  let address = addressFormData as string
  let coordinates = safeJSONParse<Coordinates, null>(coordinatesFormData, null)

  if (!address) {
    return { error: { cause: 'No location provided by user', message: t('errors.no-location') } }
  }

  if (!coordinates) {
    const PDOKLocationResult = await fetchPDOKLocation(address)

    if ('error' in PDOKLocationResult) {
      return {
        error: {
          cause: PDOKLocationResult.error.cause,
          message: t(PDOKLocationResult.error.translationKey),
        },
      }
    }

    coordinates = PDOKLocationResult.coordinates
    address = PDOKLocationResult.address
  }

  /** Post coordinates and address */
  cookieStore.set(COOKIES.ADDRESS, address, SESSION_COOKIE_OPTIONS)

  const { error } = await patchMeldingByMeldingIdLocation({
    body: {
      geometry: { coordinates: [coordinates.lat, coordinates.lng], type: 'Point' },
      properties: {},
      type: 'Feature',
    },
    path: { melding_id: meldingId },
    query: { token },
  })

  if (error) {
    return { error: { cause: error, message: t('errors.location-patch-failed') } }
  }

  /** Handle source-specific behavior for back-office users */
  const source = cookieStore.get(COOKIES.SOURCE)?.value

  // For users coming from the Back Office, the second visit to /locatie is skipped.
  // Normally, we would set the melding state to 'location_submitted' there, but for those users we do it here.
  if (source === 'back-office') {
    const { error: stateError } = await putMeldingByMeldingIdSubmitLocation({
      path: { melding_id: meldingId },
      query: { token },
    })

    if (stateError) return { error: { cause: stateError, message: t('errors.state-change-failed') } }
  }

  return redirect(source === 'back-office' ? `/bijlage#${TOP_ANCHOR_ID}` : `/locatie#${TOP_ANCHOR_ID}`)
}
