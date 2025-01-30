import { cookies } from 'next/headers'

import { Locatie } from './Locatie'

export default async () => {
  const cookieStore = await cookies()
  const prevPage = cookieStore.get('lastPanelPath')
  const locationData = cookieStore.get('location')

  return (
    <Locatie prevPage={prevPage ? prevPage.value : '/'} locationData={locationData && JSON.parse(locationData.value)} />
  )
}
