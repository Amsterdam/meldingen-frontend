'use server'

import { redirect } from 'next/navigation'

import { handleApiError } from '../../handleApiError'
import {
  getFormClassificationByClassificationId,
  postMelding,
  putMeldingByMeldingIdAnswerQuestions,
} from 'apps/back-office/src/apiClientProxy'

export type FormState = {
  formData?: FormData
  systemError?: unknown
  validationErrors?: { key: string; message: string }[]
}

type Args = {
  requiredErrorMessage: string
}

export const postPrimaryForm = async (
  { requiredErrorMessage }: Args,
  _: unknown,
  formData: FormData,
): Promise<FormState> => {
  const formDataObj = Object.fromEntries(formData)

  if (!formDataObj.primary) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: requiredErrorMessage }],
    }
  }

  const { data, error } = await postMelding({ body: { text: formDataObj.primary.toString() } })

  if (error) return { formData, systemError: error }

  const { classification, created_at, id, public_id, token } = data
  const meldingFormBaseUrl = process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL

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

      redirect(
        `${meldingFormBaseUrl}/locatie?id=${id}&token=${token}&created_at=${created_at}&public_id=${public_id}&source=back-office#top`,
      )
    }

    const nextFormFirstKey = data?.components[0].key

    return redirect(
      `${meldingFormBaseUrl}/aanvullende-vragen/${classification.id}/${nextFormFirstKey}?id=${id}&token=${token}&created_at=${created_at}&public_id=${public_id}&source=back-office#top`,
    )
  }

  redirect(
    `${meldingFormBaseUrl}/locatie?id=${id}&token=${token}&created_at=${created_at}&public_id=${public_id}&source=back-office#top`,
  )
}
