'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdContact } from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'

export const postContactForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const email = formData.get('email')
  const phone = formData.get('phone')

  if (email || phone) {
    const { error } = await postMeldingByMeldingIdContact({
      body: {
        ...(email && { email: email as string }),
        ...(phone && { phone: phone as string }),
      },
      path: { melding_id: parseInt(meldingId, 10) },
      query: { token },
    })

    if (error) return { message: handleApiError(error) }
  }

  return redirect('/samenvatting')
}
