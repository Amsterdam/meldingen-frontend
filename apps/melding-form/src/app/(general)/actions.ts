'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  getFormClassificationByClassificationId,
  postMelding,
  putMeldingByMeldingIdAnswerQuestions,
} from '@meldingen/api-client'

import { handleApiError } from '../../handleApiError'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  const { data, error } = await postMelding({ body: { text: formDataObj.primary.toString() } })

  if (error) return { errorMessage: handleApiError(error), formData }

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

      if (error) return { errorMessage: handleApiError(error), formData }

      return redirect(nextPage)
    }

    if (error) return { errorMessage: handleApiError(error), formData }

    const nextFormFirstKey = data?.components[0].key

    nextPage = `/aanvullende-vragen/${classification.id}/${nextFormFirstKey}`
  }

  return redirect(nextPage)
}
