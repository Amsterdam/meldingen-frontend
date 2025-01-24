'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam'

// TODO: not sure if this is a good idea...
const convertPointToCoordinates = (point: string) => point.replace('POINT(', '').replace(')', '').split(' ')

export const writeAddressAndCoordinateToCookie = async (_: unknown, formData: FormData) => {
  const address = formData.get('address')

  if (!address) return { message: 'Vul een locatie in.' }

  try {
    const coordinate = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`,
    ).then((res) => res.json())

    if (!coordinate.response.docs.length) {
      throw new Error('Geen adres gevonden. Vul een adres in als Amstel 1, Amsterdam.')
    }

    const location = {
      name: coordinate.response.docs[0].weergavenaam,
      coordinate: convertPointToCoordinates(coordinate.response.docs[0].centroide_ll),
    }

    const cookieStore = await cookies()
    cookieStore.set('location', JSON.stringify(location))
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect('/locatie')
}
