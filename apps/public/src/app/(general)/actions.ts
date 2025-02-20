'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getFormClassificationByClassificationId, postMelding } from 'apps/public/src/apiClientProxy'

export const postPrimaryForm = async (_: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  let nextPage = '/locatie'

  try {
    const { classification, id, token } = await postMelding({ requestBody: { text: formDataObj.primary.toString() } })

    if (classification) {
      // Set session variables in cookies
      const cookieStore = await cookies()
      cookieStore.set('id', id.toString())
      cookieStore.set('token', token)

      // Get entire form, in order to redirect to its first panel
      const nextFormData = await getFormClassificationByClassificationId({ classificationId: classification })
      const nextFormFirstKey = nextFormData.components && nextFormData.components[0].key

      nextPage = `/aanvullende-vragen/${classification}/${nextFormFirstKey}`
    }
  } catch (error) {
    return { message: (error as Error).message }
  }

  return redirect(nextPage)
}
