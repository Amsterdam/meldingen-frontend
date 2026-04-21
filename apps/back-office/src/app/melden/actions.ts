'use server'

import { redirect } from 'next/navigation'

import { MeldingOutput, postMelding } from '@meldingen/api-client'

import { URGENCY_VALUES } from '../../constants'
import { patchMeldingByMeldingId } from 'apps/back-office/src/apiClientProxy'

export type FormState = {
  formData?: FormData
  systemError?: unknown
  validationErrors?: { key: string; message: string }[]
}

const isValidUrgency = (value: number): value is MeldingOutput['urgency'] =>
  URGENCY_VALUES.includes(value as MeldingOutput['urgency'])

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

  const urgencyRaw = formDataObj.urgency
  const urgencyNumber = Number(urgencyRaw)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      formData,
      validationErrors: [{ key: 'urgency', message: `Invalid urgency: ${urgencyRaw}` }],
    }
  }

  const { error: urgencyError } = await patchMeldingByMeldingId({
    body: { urgency: urgencyNumber },
    path: { melding_id: data.id },
  })

  if (urgencyError) return { formData, systemError: urgencyError }

  const { classification, created_at, id, public_id, token } = data
  const meldingFormBaseUrl = process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL

  redirect(
    `${meldingFormBaseUrl}/back-office-entry?id=${id}&token=${token}&created_at=${created_at}&public_id=${public_id}${classification?.id ? `&classification_id=${classification.id}` : ''}`,
  )
}
