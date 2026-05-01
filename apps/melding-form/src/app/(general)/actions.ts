'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { patchMeldingByMeldingIdMelder, postMelding } from '@meldingen/api-client'

import { resolveClassificationRedirect } from '../utils'
import { hasValidationErrors } from './_utils/validation/hasValidationErrors'
import { COOKIES } from '~/constants'
import { handleApiError } from '~/handleApiError'

export type ArgsType = {
  existingId?: string
  existingToken?: string
  requiredErrorMessage: string
}

export const postPrimaryForm = async (
  { existingId, existingToken, requiredErrorMessage }: ArgsType,
  _: unknown,
  formData: FormData,
) => {
  const formDataObj = Object.fromEntries(formData)

  // Return validation error if primary question is not answered
  if (!formDataObj.primary) {
    return {
      formData,
      validationErrors: [
        {
          key: 'primary',
          message: requiredErrorMessage,
        },
      ],
    }
  }

  const isExistingMelding = existingId && existingToken

  const { data, error, response } = isExistingMelding
    ? await patchMeldingByMeldingIdMelder({
        body: { text: formDataObj.primary.toString() },
        path: { melding_id: parseInt(existingId, 10) },
        query: { token: existingToken },
      })
    : await postMelding({ body: { text: formDataObj.primary.toString() } })

  // Return other validation errors if there are any
  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: handleApiError(error) }],
    }
  }

  if (error) return { formData, systemError: error }

  const { classification, id, token } = data

  // Set session variables in cookies
  const cookieStore = await cookies()
  const oneDay = 24 * 60 * 60
  cookieStore.set(COOKIES.ID, id.toString(), { maxAge: oneDay })
  cookieStore.set(COOKIES.TOKEN, token, { maxAge: oneDay })

  // The LAST_PANEL_PATH cookie might be populated by earlier additional questions.
  // Delete it here in case a reclassification occurs.
  cookieStore.delete(COOKIES.LAST_PANEL_PATH)

  const result = await resolveClassificationRedirect(id, token, classification?.id)

  if (result.type === 'error') return { formData, systemError: result.error }

  return redirect(result.url)
}
