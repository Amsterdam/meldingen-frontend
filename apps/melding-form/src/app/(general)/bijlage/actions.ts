'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdAddAttachments } from '@meldingen/api-client'

import { COOKIES } from 'apps/melding-form/src/constants'

export const submitAttachmentsForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  // Set melding state to 'attachments_added'
  const { error } = await putMeldingByMeldingIdAddAttachments({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return { systemError: error }

  return redirect('/contact')
}
