import { cookies } from 'next/headers'

import { Location } from './Location'

export default async () => {
  const cookieStore = await cookies()
  const locationData = cookieStore.get('location')
  const prevPage = cookieStore.get('lastPanelPath')

  return (
    <Location
      locationData={locationData && JSON.parse(locationData.value)}
      prevPage={prevPage ? prevPage.value : '/'}
    />
  )
}
