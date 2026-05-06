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

export type ArgsType = {
  existingId?: string
  existingToken?: string
  requiredErrorMessage: string
}

type MeldingData = {
  classificationId?: number
  createdAt: string
  id: number
  publicId: string
  token: string
}

const isValidUrgency = (value: number): value is MeldingOutput['urgency'] =>
  URGENCY_VALUES.includes(value as MeldingOutput['urgency'])

const safeJSONParse = (jsonString?: string) => {
  if (!jsonString) return undefined

  try {
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
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

  let meldingData: MeldingData | undefined

  const prefetchedMeldingRaw = formDataObj.prefetchedMelding as string | undefined
  if (prefetchedMeldingRaw) {
    meldingData = safeJSONParse(prefetchedMeldingRaw)
  }

  if (!meldingData) {
    const { data, error, response } =
      isExistingMelding && isValidId
        ? await patchMeldingByMeldingIdMelder({
            body: { text: formDataObj.primary.toString() },
            path: { melding_id: parseInt(existingId, 10) },
            query: { token: existingToken },
          })
        : await postMelding({ body: { text: formDataObj.primary.toString() } })

    if (hasValidationErrors(response, error)) {
      return {
        formData,
        validationErrors: [{ key: 'primary', message: handleApiError(error) }],
      }
    }

    if (error) return { formData, systemError: error }

    meldingData = {
      classificationId: data.classification?.id,
      createdAt: data.created_at,
      id: data.id,
      publicId: data.public_id,
      token: data.token,
    }
  }

  const { error: urgencyError } = await patchMeldingByMeldingId({
    body: { urgency: urgencyNumber },
    path: { melding_id: meldingData.id },
  })

  if (urgencyError) return { formData, systemError: urgencyError }

  const params = new URLSearchParams({
    created_at: meldingData.createdAt,
    id: String(meldingData.id),
    public_id: meldingData.publicId,
    token: meldingData.token,
  })
  if (meldingData.classificationId) params.set('classification_id', String(meldingData.classificationId))

  redirect(`${process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL}/back-office-entry?${params}`)
}
