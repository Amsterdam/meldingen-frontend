'use server'

import { postMeldingByMeldingIdContact } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postContactForm = async (formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')
  const token = cookieStore.get('token')

  // Delete all session cookies
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name)
  })

  if (!meldingId || !token) {
    // eslint-disable-next-line no-console
    console.error('Geen meldingId of token aanwezig.')
    redirect('/')
  }

  const email = formData.get('email')?.toString() ?? ''
  const phone = formData.get('phone')?.toString() ?? ''

  postMeldingByMeldingIdContact({
    meldingId: Number(meldingId.value),
    requestBody: {
      email,
      phone,
    },
    token: token.value,
  }).catch((error) => error)

  redirect('/bedankt')
}
