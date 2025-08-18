'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  getFormClassificationByClassificationId,
  postMelding,
  putMeldingByMeldingIdAnswerQuestions,
} from '@meldingen/api-client'

import { handleApiError } from '../../handleApiError'
import { hasValidationErrors } from './_utils/hasValidationErrors'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  // Return validation error if primary question is not answered
  if (!formDataObj.primary) {
    return {
      formData,
      validationErrors: [
        {
          key: 'primary',
          message: 'Vraag is verplicht en moet worden beantwoord.',
        },
      ],
    }
  }

  const { data, error, response } = await postMelding({ body: { text: formDataObj.primary.toString() } })

  // Return other validation errors if there are any
  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [
        {
          key: 'primary',
          message: handleApiError(error),
        },
      ],
    }
  }

  if (error) return { formData, systemError: error }

  const { classification, created_at, id, token, public_id } = data

  // Set session variables in cookies
  const cookieStore = await cookies()
  cookieStore.set('id', id.toString())
  cookieStore.set('created_at', created_at)
  cookieStore.set('public_id', public_id)
  cookieStore.set('token', token)

  if (classification) {
    // Get entire form, in order to redirect to its first panel
    const { data, error } = await getFormClassificationByClassificationId({
      path: { classification_id: classification.id },
    })

    const hasAdditionalQuestions = Boolean(data?.components[0])

    // If there are no additional questions for a classification,
    // set the melding state to 'questions_answered' and redirect to /locatie.
    if (!hasAdditionalQuestions) {
      const { error } = await putMeldingByMeldingIdAnswerQuestions({
        path: { melding_id: id },
        query: { token },
      })

      if (error) return { formData, systemError: error }

      return redirect(nextPage)
    }

    if (error) return { formData, systemError: error }

    const nextFormFirstKey = data?.components[0].key

    nextPage = `/aanvullende-vragen/${classification.id}/${nextFormFirstKey}`
  }

  return redirect(nextPage)
}
