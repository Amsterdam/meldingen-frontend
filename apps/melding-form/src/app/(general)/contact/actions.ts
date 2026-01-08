'use server'

import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { patchMeldingByMeldingIdContact, putMeldingByMeldingIdAddContactInfo } from '@meldingen/api-client'

import { hasValidationErrors } from '../_utils/hasValidationErrors'
import { COOKIES } from 'apps/melding-form/src/constants'
import { isApiErrorArray } from 'apps/melding-form/src/handleApiError'

export const postContactForm = async (_: unknown, formData: FormData) => {
  const t = await getTranslations('contact.errors')

  const cookieStore = await cookies()
  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const email = formData.get('email')
  const phone = formData.get('phone')

  const { error, response } = await patchMeldingByMeldingIdContact({
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

    const emailTooLongError = emailError?.msg.includes('The email address is too long')

    return {
      formData,
      validationErrors: [
        ...(emailError
          ? [{ key: 'email-input', message: emailTooLongError ? t('email-too-long') : t('invalid-email') }]
          : []),
        ...(phoneError ? [{ key: 'tel-input', message: t('invalid-phone-number') }] : []),
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
