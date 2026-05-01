'use server'

import { redirect } from 'next/navigation'

import type { MeldingOutput } from '@meldingen/api-client'

import { patchMeldingByMeldingId, postMelding } from '~/apiClientProxy'
import { URGENCY_VALUES } from '~/constants'

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

  const urgencyRaw = formDataObj.urgency
  const urgencyNumber = Number(urgencyRaw)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      formData,
      validationErrors: [{ key: 'urgency', message: `Invalid urgency: ${urgencyRaw}` }],
    }
  }

  const { data, error } = await postMelding({ body: { text: formDataObj.primary.toString() } })

  if (error) return { formData, systemError: error }

  const { error: urgencyError } = await patchMeldingByMeldingId({
    body: { urgency: urgencyNumber },
    path: { melding_id: data.id },
  })

  if (urgencyError) return { formData, systemError: urgencyError }

  const { classification, created_at, id, public_id, token } = data
  const meldingFormBaseUrl = process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL

  const params = new URLSearchParams({ created_at, id: String(id), public_id: String(public_id), token })
  if (classification?.id) params.set('classification_id', String(classification.id))

  redirect(`${meldingFormBaseUrl}/back-office-entry?${params}`)
}
