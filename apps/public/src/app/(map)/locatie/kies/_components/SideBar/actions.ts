'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam'

// TODO: not sure if this is a good idea...
const convertPointToCoordinates = (point: string) => point.replace('POINT(', '').replace(')', '').split(' ')

export const writeAddressAndCoordinateToCookie = async (_: unknown, formData: FormData) => {
  const address = formData.get('address')

  try {
    const coordinate = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`,
    ).then((res) => res.json())

    const cookieStore = await cookies()

    const location = {
      name: coordinate.response.docs[0].weergavenaam,
      coordinate: convertPointToCoordinates(coordinate.response.docs[0].centroide_ll),
    }

    console.log(location)

    cookieStore.set('location', JSON.stringify(location))
  } catch (error) {
    console.error(error)
  }

  return redirect('/locatie')
}
