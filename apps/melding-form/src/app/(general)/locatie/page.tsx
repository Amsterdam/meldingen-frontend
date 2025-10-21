import { cookies } from 'next/headers'

import { Location } from './Location'
import { COOKIES } from 'apps/melding-form/src/constants'

export default async () => {
  const cookieStore = await cookies()
  const address = cookieStore.get('address')?.value
  const prevPage = cookieStore.get(COOKIES.LAST_PANEL_PATH)

  return <Location address={address} prevPage={prevPage ? prevPage.value : '/'} />
}
