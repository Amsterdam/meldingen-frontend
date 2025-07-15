'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { convertWktPointToCoordinates } from '../../_utils/convertWktPointToCoordinates'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam'

export const writeAddressAndCoordinateToCookie = async (_: unknown, formData: FormData) => {
  const address = formData.get('address')
  const coordinates = formData.get('coordinates')

  const t = await getTranslations('select-location')

  if (!address) return { errorMessage: t('errors.no-location') }

  let PDOKLocation = null

  if (!coordinates) {
    const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`)

    if (!res.ok) return { errorMessage: 'PDOK API error' }

    PDOKLocation = await res.json()

    if (!PDOKLocation.response.docs.length) return { errorMessage: t('errors.pdok-no-address-found') }
  }

  const PDOKCoordinates = PDOKLocation && convertWktPointToCoordinates(PDOKLocation.response.docs[0].centroide_ll)

  if (!coordinates && !PDOKCoordinates) return { errorMessage: 'No coordinates found' }

  const location = {
    name: coordinates ? address : PDOKLocation.response.docs[0].weergavenaam,
    coordinates: coordinates ? JSON.parse(coordinates as string) : PDOKCoordinates,
  }

  const cookieStore = await cookies()
  cookieStore.set('location', JSON.stringify(location))

  return redirect('/locatie')
}
