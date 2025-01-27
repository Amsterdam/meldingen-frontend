'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdLocation } from 'apps/public/src/apiClientProxy'

export const postLocationForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const coordinate = formData.get('coordinate')

  if (!coordinate) return { message: 'Vul een locatie in.' }

  const parsedCoordinate = JSON.parse(coordinate as string)

  try {
    await postMeldingByMeldingIdLocation({
      meldingId: parseInt(meldingId, 10),
      token,
      requestBody: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: parsedCoordinate,
        },
        properties: {},
      },
    })
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect('/bijlage')
}
