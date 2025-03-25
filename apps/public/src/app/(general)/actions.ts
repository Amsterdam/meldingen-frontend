'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getFormClassificationByClassificationId, postMelding } from '@meldingen/api-client'

import { handleApiError } from '../../handleApiError'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  const { data, error } = await postMelding({ body: { text: formDataObj.primary.toString() } })

  if (error) return { message: handleApiError(error) }

  const { classification, id, token } = data

  // Set session variables in cookies
  const cookieStore = await cookies()
  cookieStore.set('id', id.toString())
  cookieStore.set('token', token)

  if (classification) {
    // Get entire form, in order to redirect to its first panel
    const { data, error } = await getFormClassificationByClassificationId({
      path: { classification_id: classification },
    })

    // If there are no additional questions for a classification, redirect to /locatie.
    if (handleApiError(error) === 'Not Found') return redirect(nextPage)

    // Return other errors to the user
    if (error) return { message: handleApiError(error) }

    const nextFormFirstKey = data?.components[0].key

    nextPage = `/aanvullende-vragen/${classification}/${nextFormFirstKey}`
  }

  return redirect(nextPage)
}
