'use client'

import { useEffect } from 'react'

import { clearSession } from './actions'
import { COOKIES } from '~/constants'

const TAB_MARKER_KEY = 'meldingen_tab'
const LOCK_NAME = 'meldingen_session'

// The back-office entry route sets a short-lived flag, because it sets a new session in a tab without a marker.
// Read and delete it, so that session is not cleared straight away.
const consumeNewSessionFlag = () => {
  const hasFlag = document.cookie.split('; ').includes(`${COOKIES.NEW_SESSION}=true`)

  if (hasFlag) {
    document.cookie = `${COOKIES.NEW_SESSION}=; path=/; max-age=0`
  }

  return hasFlag
}

// Clears the session when a tab is opened after all other tabs with that session were closed.
// A refresh or a new tab next to an open session keeps the session.
// - sessionStorage survives a refresh, but is empty in a new tab.
// - Every tab holds a shared Web Lock, which the browser releases when the tab closes.
// Without JavaScript or Web Locks, the session lasts until the browser closes.
export const TabSessionGuard = () => {
  useEffect(() => {
    if (!('locks' in navigator)) return

    const isNewTab = sessionStorage.getItem(TAB_MARKER_KEY) === null

    sessionStorage.setItem(TAB_MARKER_KEY, 'true')

    const isNewSession = consumeNewSessionFlag()

    const checkSession = async () => {
      // Query before requesting the lock for this tab, so only other tabs are counted
      const { held = [] } = await navigator.locks.query()
      const isOpenInOtherTab = held.some((lock) => lock.name === LOCK_NAME)

      // The promise never resolves, so the lock is held until this tab closes
      navigator.locks.request(LOCK_NAME, { mode: 'shared' }, () => new Promise(() => {}))

      if (isNewTab && !isOpenInOtherTab && !isNewSession) {
        await clearSession()
      }
    }

    checkSession()
  }, [])

  return null
}
