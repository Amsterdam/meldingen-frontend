'use server'

import { redirect } from 'next/navigation'

const queryParams = 'fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=centroide_ll,weergavenaam'

export const writeAddressAndCoordinateToCookie = async (_: unknown, formData: FormData) => {
  const address = formData.get('address')

  try {
    const coordinate = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${address}&${queryParams}`,
    ).then((res) => res.json())

    console.log('----coordinate', coordinate.response.docs[0])
  } catch (error) {
    console.error(error)
  }

  return redirect('/locatie')
}
