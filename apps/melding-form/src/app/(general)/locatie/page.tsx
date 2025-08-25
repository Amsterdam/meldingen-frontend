import { cookies } from 'next/headers'

import { Location } from './Location'

export default async () => {
  const cookieStore = await cookies()
  const prevPage = cookieStore.get('lastPanelPath')
  const locationData = cookieStore.get('location')

  return (
    <Location
      prevPage={prevPage ? prevPage.value : '/'}
      locationData={locationData && JSON.parse(locationData.value)}
    />
  )
}
