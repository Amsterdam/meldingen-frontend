'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  getFormClassificationByClassificationId,
  patchMeldingByMeldingId,
  postMelding,
  putMeldingByMeldingIdAnswerQuestions,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

import { COOKIES } from '../../constants'
import { handleApiError } from '../../handleApiError'
import { hasValidationErrors } from './_utils/hasValidationErrors'

type ArgsType = {
  existingId?: string
  existingToken?: string
  formComponents: StaticFormTextAreaComponentOutput[]
}

export const postPrimaryForm = async (
  { existingId, existingToken, formComponents }: ArgsType,
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
          message:
            formComponents.find((component) => component.key === 'primary')?.validate?.required_error_message ||
            'Vraag is verplicht en moet worden beantwoord.',
        },
      ],
    }
  }

  const isExistingMelding = existingId && existingToken

  const { data, error, response } = isExistingMelding
    ? await patchMeldingByMeldingId({
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

  const { classification, created_at, id, public_id, token } = data

  // Set session variables in cookies
  const cookieStore = await cookies()
  const oneDay = 24 * 60 * 60
  cookieStore.set(COOKIES.ID, id.toString(), { maxAge: oneDay })
  cookieStore.set(COOKIES.CREATED_AT, created_at, { maxAge: oneDay })
  cookieStore.set(COOKIES.PUBLIC_ID, public_id, { maxAge: oneDay })
  cookieStore.set(COOKIES.TOKEN, token, { maxAge: oneDay })

  // The LAST_PANEL_PATH cookie might be populated by earlier additional questions.
  // Delete it here in case a reclassification occurs.
  cookieStore.delete(COOKIES.LAST_PANEL_PATH)

  if (classification) {
    // Get entire form, in order to redirect to its first panel
    const { data, error } = await getFormClassificationByClassificationId({
      path: { classification_id: classification.id },
    })

    if (error && handleApiError(error) !== 'Not Found') {
      return { formData, systemError: error }
    }

    const hasAdditionalQuestions = Boolean(data?.components[0])

    // If there are no additional questions for a classification,
    // set the melding state to 'questions_answered' and redirect to /locatie.
    if (!hasAdditionalQuestions) {
      const { error } = await putMeldingByMeldingIdAnswerQuestions({
        path: { melding_id: id },
        query: { token },
      })

      if (error) return { formData, systemError: error }

      return redirect('/locatie')
    }

    const nextFormFirstKey = data?.components[0].key

    return redirect(`/aanvullende-vragen/${classification.id}/${nextFormFirstKey}`)
  }

  return redirect('/locatie')
}
