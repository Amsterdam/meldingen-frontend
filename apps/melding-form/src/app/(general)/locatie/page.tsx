import { cookies } from 'next/headers'

import { Location } from './Location'
import { SESSION_COOKIES } from 'apps/melding-form/src/constants'

export default async () => {
  const cookieStore = await cookies()
  const address = cookieStore.get('address')?.value
  const prevPage = cookieStore.get(SESSION_COOKIES.LAST_PANEL_PATH)

  return <Location address={address} prevPage={prevPage ? prevPage.value : '/'} />
}
