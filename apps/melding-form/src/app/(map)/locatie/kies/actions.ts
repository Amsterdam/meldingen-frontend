'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { type Feature, patchMeldingByMeldingIdLocation, postMeldingByMeldingIdAsset } from '@meldingen/api-client'

import { convertWktPointToCoordinates } from './_utils/convertWktPointToCoordinates'
import { COOKIES } from 'apps/melding-form/src/constants'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam'

export const postCoordinatesAndAssets = async (
  { selectedAssets }: { selectedAssets: Feature[] },
  _: unknown,
  formData: FormData,
) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const address = formData.get('address')
  const coordinates = formData.get('coordinates')
  const t = await getTranslations('select-location')

  /** Post assets */

  if (selectedAssets.length > 0) {
    for (const asset of selectedAssets) {
      const { error } = await postMeldingByMeldingIdAsset({
        body: {
          external_id: String(asset.id),
          asset_type_id: 1,
        },
        path: { melding_id: parseInt(meldingId, 10) },
        query: { token },
      })

      if (error) {
        return { errorMessage: handleApiError(error) }
      }
    }
  }

  /** Fallback to fetch address when Javascript is not working in the browser */

  let PDOKLocation = null

  if (!address) return { errorMessage: t('errors.no-location') }

  if (!coordinates) {
    const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`)

    if (!res.ok) return { errorMessage: 'PDOK API error' }

    PDOKLocation = await res.json()

    if (!PDOKLocation.response.docs.length) return { errorMessage: t('errors.pdok-no-address-found') }
  }

  const PDOKCoordinates = PDOKLocation && convertWktPointToCoordinates(PDOKLocation.response.docs[0].centroide_ll)

  if (!coordinates && !PDOKCoordinates) return { errorMessage: 'No coordinates found' }

  /** Post coordinates and address */

  const addressCookie: string = coordinates ? address : PDOKLocation.response.docs[0].weergavenaam

  cookieStore.set('address', addressCookie)

  const parsedCoordinates = coordinates ? JSON.parse(coordinates as string) : PDOKCoordinates

  const { error } = await patchMeldingByMeldingIdLocation({
    body: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [parsedCoordinates.lat, parsedCoordinates.lng] },
      properties: {},
    },
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) {
    return { errorMessage: handleApiError(error) }
  }

  return redirect('/locatie')
}
