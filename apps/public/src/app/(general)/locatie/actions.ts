'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdLocation } from 'apps/public/src/apiClientProxy'

export const postLocationForm = async (_: unknown, formData: FormData) => {
  const coordinate = formData.get('coordinate')
  const parsedCoordinate = coordinate ? JSON.parse(coordinate as string) : undefined

  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!parsedCoordinate || !meldingId || !token) return undefined

  try {
    postMeldingByMeldingIdLocation({
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
