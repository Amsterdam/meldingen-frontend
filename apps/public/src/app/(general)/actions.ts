'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { ApiError } from 'apps/public/src/apiClientProxy'
import { getFormClassificationByClassificationId, postMelding } from 'apps/public/src/apiClientProxy'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  try {
    const { classification, id, token } = await postMelding({ requestBody: { text: formDataObj.primary.toString() } })

    // Set session variables in cookies
    const cookieStore = await cookies()
    cookieStore.set('id', id.toString())
    cookieStore.set('token', token)

    if (classification) {
      // Get entire form, in order to redirect to its first panel
      const nextFormData = await getFormClassificationByClassificationId({ classificationId: classification })
      const nextFormFirstKey = nextFormData.components && nextFormData.components[0].key

      nextPage = `/aanvullende-vragen/${classification}/${nextFormFirstKey}`
    }
  } catch (error) {
    // If there are no additional questions for a classification, redirect to /locatie.
    if ((error as ApiError)?.status === 404) {
      redirect(nextPage)
    }

    return { message: (error as ApiError).message }
  }

  return redirect(nextPage)
}
