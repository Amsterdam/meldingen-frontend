import { cookies } from 'next/headers'

import { COOKIES } from '~/constants'

export const getOverviewHref = async () => {
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIES.OVERVIEW_PAGE)?.value

  if (!value) return '/'

  const page = parseInt(value, 10)

  if (isNaN(page) || page <= 1) return '/'

  return `/?pagina=${page}`
}
