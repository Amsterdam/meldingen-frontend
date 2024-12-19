import { cookies } from 'next/headers'

import { Locatie } from './Locatie'

export default async () => {
  const cookieStore = await cookies()
  const prevPage = cookieStore.get('lastPanelPath')

  return <Locatie prevPage={prevPage ? prevPage.value : '/'} />
}
