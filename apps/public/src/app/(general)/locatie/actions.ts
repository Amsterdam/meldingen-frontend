'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { Position2D } from 'apps/public/src/apiClientProxy'
import { postMeldingByMeldingIdLocation } from 'apps/public/src/apiClientProxy'

// TODO: not sure if this is a good idea...
const convertWktPointToCoordinates = (point: string) =>
  point.replace('POINT(', '').replace(')', '').split(' ').map(parseFloat).reverse()

export const postLocationForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const coordinate = formData.get('coordinate')

  if (!coordinate) return { message: 'Vul een locatie in.' }

  const parsedCoordinate = convertWktPointToCoordinates(coordinate as string) as Position2D

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
