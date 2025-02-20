'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  getFormClassificationByClassificationId,
  postMelding,
  putMeldingByMeldingIdAnswerQuestions,
} from 'apps/public/src/apiClientProxy'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  const { classification, id, token } = await postMelding({ requestBody: { text: formDataObj.primary.toString() } })

  // Set session variables in cookies
  const cookieStore = await cookies()
  cookieStore.set('id', id.toString())
  cookieStore.set('token', token)

  try {
    if (classification) {
      // Get entire form, in order to redirect to its first panel
      const nextFormData = await getFormClassificationByClassificationId({ classificationId: classification })
      const nextFormFirstKey = nextFormData.components && nextFormData.components[0].key

      nextPage = `/aanvullende-vragen/${classification}/${nextFormFirstKey}`
    } else {
      putMeldingByMeldingIdAnswerQuestions({ meldingId: id, token })
    }
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect(nextPage)
}
