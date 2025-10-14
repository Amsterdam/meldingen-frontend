import { cookies } from 'next/headers'

import { Location } from './Location'

export default async () => {
  const cookieStore = await cookies()
  const address = cookieStore.get('address')?.value
  const prevPage = cookieStore.get('lastPanelPath')

  return <Location address={address} prevPage={prevPage ? prevPage.value : '/'} />
}
