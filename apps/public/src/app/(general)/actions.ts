'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { ApiError } from 'apps/public/src/apiClientProxy'
import { getFormClassificationByClassificationId, postMelding } from 'apps/public/src/apiClientProxy'

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'name' in error && error.name === 'ApiError'

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
    if (isApiError(error)) {
      if (error.statusText === 'Not Found') {
        // When a classification does not have additional question go to next page
        redirect(nextPage)
      }

      return { message: error.message }
    }
    // eslint-disable-next-line no-console
    console.error('Unexpected error caught:', error)
  }

  return redirect(nextPage)
}
