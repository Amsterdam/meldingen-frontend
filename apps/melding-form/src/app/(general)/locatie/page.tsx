import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Location } from './Location'

export const generateMetadata = async () => {
  const t = await getTranslations('location')

  return {
    title: t('metadata.title'),
  }
}

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
