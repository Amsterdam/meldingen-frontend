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

  if (!address) return { message: t('errors.no-location') }

  try {
    // If we don't have coordinates for some reason, we fetch it from the PDOK API using the address.
    // This should only happen if the user has disabled JavaScript or a PDOK service is down.
    const PDOKLocation = !coordinates
      ? await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`).then((res) =>
          res.json(),
        )
      : null

    if (PDOKLocation && !PDOKLocation.response.docs.length) {
      throw new Error(t('pdok-no-address-found'))
    }

    const location = {
      name: coordinates ? address : PDOKLocation.response.docs[0].weergavenaam,
      coordinates: coordinates
        ? JSON.parse(coordinates as string)
        : convertWktPointToCoordinates(PDOKLocation.response.docs[0].centroide_ll),
    }

    const cookieStore = await cookies()
    cookieStore.set('location', JSON.stringify(location))
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect('/locatie')
}
