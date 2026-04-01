'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdSubmitMelder } from '@meldingen/api-client'

import { COOKIES, TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

export const postSummaryForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect(`/cookie-storing#${TOP_ANCHOR_ID}`)

  // Set melding state to 'submitted'
  const { error } = await putMeldingByMeldingIdSubmitMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error)
    return { systemError: error }

    // Delete ADDRESS, TOKEN, LAST_PANEL_PATH, ID, and SOURCE cookies
  ;[COOKIES.ADDRESS, COOKIES.TOKEN, COOKIES.LAST_PANEL_PATH, COOKIES.ID, COOKIES.SOURCE].forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  return redirect(`/bedankt#${TOP_ANCHOR_ID}`)
}
