'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// import { putMeldingByMeldingIdSubmit } from '@meldingen/api-client'

export const postSummaryForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  try {
    // TODO: currently doesn't work because we haven't handled the previous state transitions yet. See SIG-6402
    // await putMeldingByMeldingIdSubmit({ meldingId: parseInt(meldingId, 10), token })
  } catch (error) {
    return { message: (error as Error).message }
  }

  // Delete location, token and lastPanelpath cookies
  ;['location', 'token', 'lastPanelPath'].forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  return redirect('/bedankt')
}
