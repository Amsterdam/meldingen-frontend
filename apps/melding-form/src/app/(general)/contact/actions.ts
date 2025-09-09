'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { patchMeldingByMeldingIdContact, putMeldingByMeldingIdAddContactInfo } from '@meldingen/api-client'

import { hasValidationErrors } from '../_utils/hasValidationErrors'
import { isApiErrorArray } from 'apps/melding-form/src/handleApiError'

export const postContactForm = async (_: unknown, formData: FormData) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const email = formData.get('email')
  const phone = formData.get('phone')

  const { response, error } = await patchMeldingByMeldingIdContact({
    body: {
      email: email ? (email as string) : null,
      phone: phone ? (phone as string) : null,
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

  // Set melding state to 'contact_info_added'
  const { error: stateChangeError } = await putMeldingByMeldingIdAddContactInfo({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (stateChangeError) return { formData, systemError: stateChangeError }

  return redirect('/samenvatting')
}
