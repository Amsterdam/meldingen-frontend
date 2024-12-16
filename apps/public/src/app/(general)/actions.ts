'use server'

import { getFormClassificationByClassificationId, postMelding } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postPrimaryForm = async (formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  const { classification, id, token } = await postMelding({ requestBody: { text: formDataObj.primary.toString() } })

  if (classification) {
    // Set session variables in cookies
    const cookieStore = await cookies()
    cookieStore.set('id', id.toString())
    cookieStore.set('token', token)

    // Get entire form, in order to redirect to its first panel
    const nextFormData = await getFormClassificationByClassificationId({ classificationId: classification })
    const nextFormFirstKey = nextFormData.components && nextFormData.components[0].key

    redirect(`/aanvullende-vragen/${classification}/${nextFormFirstKey}`)
  }
}
