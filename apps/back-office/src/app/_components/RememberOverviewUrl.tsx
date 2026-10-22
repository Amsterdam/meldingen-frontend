'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { COOKIES } from '~/constants'

export const RememberOverviewPage = () => {
  const pathname = usePathname()
  const query = useSearchParams().toString()

  useEffect(() => {
    const url = query ? `${pathname}?${query}` : pathname

    document.cookie = `${COOKIES.LAST_OVERVIEW_URL}=${encodeURIComponent(url)}; path=/; samesite=lax`
  }, [pathname, query])

  return null
}
