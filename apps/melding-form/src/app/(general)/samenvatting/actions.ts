'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdSubmitMelder } from '@meldingen/api-client'

import { COOKIES, TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

export const postSummaryForm = async ({ created_at, public_id }: { created_at: string; public_id: string }) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect(`/cookie-storing#${TOP_ANCHOR_ID}`)

  const source = cookieStore.get(COOKIES.SOURCE)?.value

  // Set melding state to 'submitted'
  const { error } = await putMeldingByMeldingIdSubmitMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) {
    return { systemError: error }
  }

  // Delete all session cookies
  Object.values(COOKIES).forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  const params = new URLSearchParams({ created_at, public_id })
  if (source) {
    params.set('id', meldingId)
    params.set('source', source)
  }

  return redirect(`/bedankt?${params.toString()}#${TOP_ANCHOR_ID}`)
}
