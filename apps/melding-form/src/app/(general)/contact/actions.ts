'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdContact, putMeldingByMeldingIdAddContactInfo } from '@meldingen/api-client'

import { hasValidationErrors } from '../_utils/hasValidationErrors'
import { isApiErrorArray } from 'apps/melding-form/src/handleApiError'

export const postContactForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const email = formData.get('email')
  const phone = formData.get('phone')

  if (email || phone) {
    const { response, error } = await postMeldingByMeldingIdContact({
      body: {
        ...(email && { email: email as string }),
        ...(phone && { phone: phone as string }),
      },
      path: { melding_id: parseInt(meldingId, 10) },
      query: { token },
    })

    // Return validation errors if there are any
    if (hasValidationErrors(response, error) && isApiErrorArray(error)) {
      const emailError = error?.detail.find((error) => error.loc.includes('email'))
      const phoneError = error?.detail.find((error) => error.loc.includes('phone'))

      return {
        formData,
        validationErrors: [
          ...(emailError ? [{ key: 'email-input', message: emailError.msg }] : []),
          ...(phoneError ? [{ key: 'tel-input', message: phoneError.msg }] : []),
        ],
      }
    }

    if (error) return { formData, systemError: error }
  }

  // Set melding state to 'contact_info_added'
  const { error } = await putMeldingByMeldingIdAddContactInfo({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return { formData, systemError: error }

  return redirect('/samenvatting')
}
