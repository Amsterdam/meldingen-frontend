'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam'

export const writeAddressAndCoordinateToCookie = async (_: unknown, formData: FormData) => {
  const address = formData.get('address')
  const coordinate = formData.get('coordinate')

  if (!address) return { message: 'Vul een locatie in.' }

  try {
    // If we don't have a coordinate for some reason, we fetch it from the PDOK API using the address.
    // This should only happen if the user has disabled JavaScript or a PDOK service is down.
    const PDOKLocation = !coordinate
      ? await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`).then((res) =>
          res.json(),
        )
      : null

    if (PDOKLocation && !PDOKLocation.response.docs.length) {
      throw new Error('Geen adres gevonden. Vul een adres in als Amstel 1, Amsterdam.')
    }

    const location = {
      name: coordinate ? address : PDOKLocation.response.docs[0].weergavenaam,
      coordinate: coordinate || PDOKLocation.response.docs[0].centroide_ll,
    }

    const cookieStore = await cookies()
    cookieStore.set('location', JSON.stringify(location))
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect('/locatie')
}
