'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdContact, putMeldingByMeldingIdAddContactInfo } from '@meldingen/api-client'

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

    // Email and phone validation errors have type="value_error"
    // This differs from JSONLogic validation errors, which do not have a type
    const hasValidationErrors =
      response.status === 422 && isApiErrorArray(error) && error?.detail?.some((error) => error.type === 'value_error')

    // Return validation errors if there are any
    if (hasValidationErrors) {
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
