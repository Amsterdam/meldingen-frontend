import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { Locatie } from './Locatie'

export const metadata: Metadata = {
  title: 'Stap 1 van 4 - Beschrijf uw melding - Gemeente Amsterdam',
}

export default async () => {
  const cookieStore = await cookies()
  const prevPage = cookieStore.get('lastPanelPath')
  const locationData = cookieStore.get('location')

  return (
    <Locatie prevPage={prevPage ? prevPage.value : '/'} locationData={locationData && JSON.parse(locationData.value)} />
  )
}
