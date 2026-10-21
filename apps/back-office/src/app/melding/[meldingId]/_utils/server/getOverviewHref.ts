import { cookies } from 'next/headers'

import { COOKIES } from '~/constants'

// Only same-origin relative paths are allowed, to prevent an open redirect via a tampered cookie.
// `//` and `/\` are rejected because browsers treat them as protocol-relative URLs.
const isRelativePath = (value: string) => value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')

export const getOverviewHref = async () => {
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIES.LAST_OVERVIEW_URL)?.value

  if (!value || !isRelativePath(value)) return '/'

  return value
}
