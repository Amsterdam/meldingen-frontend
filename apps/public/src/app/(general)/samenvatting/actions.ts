'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdSubmit } from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'

export const postSummaryForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  // Set melding state to 'submitted'
  const { error } = await putMeldingByMeldingIdSubmit({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error)
    return { message: handleApiError(error) }

    // Delete location, token and lastPanelpath cookies
  ;['location', 'token', 'lastPanelPath'].forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  return redirect('/bedankt')
}
