'use server'

import { postMeldingByMeldingIdContact } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postContactForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const email = formData.get('email')
  const phone = formData.get('phone')

  if (email || phone) {
    try {
      postMeldingByMeldingIdContact({
        meldingId: parseInt(meldingId, 10),
        requestBody: {
          email: email as string,
          phone: phone as string,
        },
        token,
      })
    } catch (error) {
      return { message: (error as Error).message }
    }
  }

  return redirect('/bedankt')
}
