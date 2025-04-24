'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdAddAttachments } from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'

export const redirectToNextPage = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  // Set melding state to 'attachments_added'
  const { error } = await putMeldingByMeldingIdAddAttachments({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return { message: handleApiError(error) }

  return redirect('/contact')
}
