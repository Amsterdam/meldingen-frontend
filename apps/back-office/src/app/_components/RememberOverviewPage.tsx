'use client'

import { useEffect } from 'react'

import { COOKIES } from '~/constants'

type Props = {
  page?: number
}

// Session cookie (no max-age), so the "back to overview" link on the detail pages
// returns to this page during the session and falls back to page 1 in a new session.
// New session start after the browser is closed. Except if the browser restores the previous session.
export const RememberOverviewPage = ({ page = 1 }: Props) => {
  useEffect(() => {
    document.cookie = `${COOKIES.OVERVIEW_PAGE}=${page}; path=/; samesite=strict`
  }, [page])

  return null
}
