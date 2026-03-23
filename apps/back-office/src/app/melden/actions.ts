'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { handleApiError } from '../../handleApiError'
import {
  getFormClassificationByClassificationId,
  // patchMeldingByMeldingIdMelder,
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

// const getUrgencyFromFormData = (formValue: 'high' | 'medium' | 'low') => {
//   switch (formValue) {
//     case 'high':
//       return 1
//     case 'low':
//       return -1
//     default:
//       return 0
//   }
// }

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

  // const urgency = getUrgencyFromFormData(formDataObj.urgency as 'high' | 'medium' | 'low')

  // const { error: urgencyError } = await patchMeldingByMeldingIdMelder({
  //   body: { text: formDataObj.primary.toString(), urgency },
  //   path: { melding_id: data.id },
  //   query: { token: data.token },
  // })

  // if (urgencyError) return { formData, systemError: urgencyError }

  const { classification, created_at, id, public_id, token } = data

  // Set session variables in cookies
  // TODO: use constant for this
  const cookieStore = await cookies()
  const oneDay = 24 * 60 * 60
  cookieStore.set('meldingen_id', id.toString(), { maxAge: oneDay })
  cookieStore.set('meldingen_created_at', created_at, { maxAge: oneDay })
  cookieStore.set('meldingen_public_id', public_id, { maxAge: oneDay })
  cookieStore.set('meldingen_token', token, { maxAge: oneDay })
  cookieStore.set('meldingen_source', 'back-office', { maxAge: oneDay })

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

      return redirect(`/melden/locatie#top`)
    }

    const nextFormFirstKey = data?.components[0].key

    return redirect(`/melden/aanvullende-vragen/${classification.id}/${nextFormFirstKey}#top`)
  }

  return redirect(`/melden/locatie#top`)
}
