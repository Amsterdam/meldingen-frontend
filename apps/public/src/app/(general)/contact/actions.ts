'use server'

import { postMeldingByMeldingIdContact } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postContactForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')
  const token = cookieStore.get('token')

  if (!meldingId || !token) return undefined

  const email = formData.get('email')
  const phone = formData.get('phone')

  if (email || phone) {
    try {
      postMeldingByMeldingIdContact({
        meldingId: Number(meldingId.value),
        requestBody: {
          email: email as string,
          phone: phone as string,
        },
        token: token.value,
      })
    } catch (error) {
      return { message: (error as Error).message }
    }
  }

  return redirect('/bedankt')
}
