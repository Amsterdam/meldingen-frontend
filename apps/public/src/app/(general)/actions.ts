'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getFormClassificationByClassificationId, postMelding } from '@meldingen/api-client'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  try {
    const response = await postMelding({ body: { text: formDataObj.primary.toString() } })
    const { classification, id, token } = response.data || {}

    if (!id || !token) return

    // Set session variables in cookies
    const cookieStore = await cookies()
    cookieStore.set('id', id.toString())
    cookieStore.set('token', token)

    if (classification) {
      // Get entire form, in order to redirect to its first panel
      const { data } = await getFormClassificationByClassificationId({ path: { classification_id: classification } })
      const nextFormFirstKey = data?.components && data.components[0].key

      nextPage = `/aanvullende-vragen/${classification}/${nextFormFirstKey}`
    }
  } catch (error) {
    // If there are no additional questions for a classification, redirect to /locatie.
    if ((error as { status?: number }).status === 404) {
      redirect(nextPage)
    }

    return { message: (error as Error).message }
  }

  return redirect(nextPage)
}
