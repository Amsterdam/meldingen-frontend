'use server'

import { redirect } from 'next/navigation'

import { postMelding } from '@meldingen/api-client'

import { patchMeldingByMeldingId } from 'apps/back-office/src/apiClientProxy'

export type FormState = {
  formData?: FormData
  systemError?: unknown
  validationErrors?: { key: string; message: string }[]
}

const getUrgencyFromFormData = (formValue: 'high' | 'medium' | 'low') => {
  switch (formValue) {
    case 'high':
      return 1
    case 'low':
      return -1
    default:
      return 0
  }
}

export const postMeldingForm = async (_: unknown, formData: FormData): Promise<FormState> => {
  const formDataObj = Object.fromEntries(formData)

  if (!formDataObj.primary) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: 'This field is required.' }],
    }
  }

  const { data, error } = await postMelding({ body: { text: formDataObj.primary.toString() } })

  if (error) return { formData, systemError: error }

  const urgency = getUrgencyFromFormData(formDataObj.urgency as 'high' | 'medium' | 'low')

  const { error: urgencyError } = await patchMeldingByMeldingId({
    body: { urgency },
    path: { melding_id: data.id },
  })

  if (urgencyError) return { formData, systemError: urgencyError }

  const { classification, created_at, id, public_id, token } = data
  const meldingFormBaseUrl = process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL

  redirect(
    `${meldingFormBaseUrl}/back-office-entry?id=${id}&token=${token}&created_at=${created_at}&public_id=${public_id}${classification?.id ? `&classification_id=${classification.id}` : ''}`,
  )
}
