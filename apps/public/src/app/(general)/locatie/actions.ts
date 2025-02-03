'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdLocation } from 'apps/public/src/apiClientProxy'

export const postLocationForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const coordinates = formData.get('coordinates')

  if (!coordinates) return { message: 'Vul een locatie in.' }

  const parsedCoordinates = JSON.parse(coordinates as string)

  try {
    await postMeldingByMeldingIdLocation({
      meldingId: parseInt(meldingId, 10),
      token,
      requestBody: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parsedCoordinates.lat, parsedCoordinates.lng],
        },
        properties: {},
      },
    })
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect('/bijlage')
}
