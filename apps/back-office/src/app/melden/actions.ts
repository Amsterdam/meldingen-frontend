'use server'

import { redirect } from 'next/navigation'

import type { MeldingOutput } from '@meldingen/api-client'

import { hasValidationErrors } from './_utils/hasValidationErrors'
import { patchMeldingByMeldingId, patchMeldingByMeldingIdMelder, postMelding } from '~/apiClientProxy'
import { URGENCY_VALUES } from '~/constants'
import { handleApiError } from '~/handleApiError'

export type FormState = {
  formData?: FormData
  systemError?: unknown
  validationErrors?: { key: string; message: string }[]
}

const isValidUrgency = (value: number): value is MeldingOutput['urgency'] =>
  URGENCY_VALUES.includes(value as MeldingOutput['urgency'])

export type ArgsType = {
  existingId?: string
  existingToken?: string
  requiredErrorMessage: string
}

export const postMeldingForm = async (
  { existingId, existingToken, requiredErrorMessage }: ArgsType,
  _: unknown,
  formData: FormData,
): Promise<FormState> => {
  const formDataObj = Object.fromEntries(formData)

  // Return validation error if primary question is not answered
  if (!formDataObj.primary) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: requiredErrorMessage }],
    }
  }

  const urgencyRaw = formDataObj.urgency
  const urgencyNumber = Number(urgencyRaw)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      formData,
      systemError: `Invalid urgency value: ${urgencyRaw}`,
    }
  }

  const isExistingMelding = existingId && existingToken
  const isValidId = Number.isFinite(Number(existingId))

  const { data, error, response } =
    isExistingMelding && isValidId
      ? await patchMeldingByMeldingIdMelder({
          body: { text: formDataObj.primary.toString() },
          path: { melding_id: parseInt(existingId, 10) },
          query: { token: existingToken },
        })
      : await postMelding({ body: { text: formDataObj.primary.toString() } })

  // Return other validation errors if there are any
  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: handleApiError(error) }],
    }
  }

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
