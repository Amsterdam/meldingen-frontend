'use server'

import { redirect } from 'next/navigation'

import type { MeldingOutput } from '@meldingen/api-client'

import { hasValidationErrors } from './_utils/hasValidationErrors'
import { MeldingData } from './types'
import { patchMeldingByMeldingId, patchMeldingByMeldingIdMelder, postMelding } from '~/apiClientProxy'
import { URGENCY_VALUES } from '~/constants'
import { handleApiError } from '~/handleApiError'

export type FormState = {
  formData?: FormData
  systemError?: unknown
  validationErrors?: { key: string; message: string }[]
}

export type ArgsType = {
  existingId?: number
  existingToken?: string
  requiredErrorMessage: string
}

const isValidUrgency = (value: number): value is MeldingOutput['urgency'] =>
  URGENCY_VALUES.includes(value as MeldingOutput['urgency'])

const isMeldingData = (value: unknown): value is MeldingData =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as MeldingData).id === 'number' &&
  typeof (value as MeldingData).token === 'string' &&
  typeof (value as MeldingData).publicId === 'string' &&
  typeof (value as MeldingData).createdAt === 'string'

const safeJSONParse = (jsonString: string) => {
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

  const prefetchedMeldingRaw = formDataObj.prefetchedMelding as string | undefined
  const prefetchedMelding = prefetchedMeldingRaw ? safeJSONParse(prefetchedMeldingRaw) : undefined
  const validPrefetchedMelding = isMeldingData(prefetchedMelding) ? prefetchedMelding : undefined

  const meldingIdForPatch = validPrefetchedMelding?.id ?? existingId
  const meldingTokenForPatch = validPrefetchedMelding?.token ?? existingToken

  const { data, error, response } =
    meldingIdForPatch && meldingTokenForPatch
      ? await patchMeldingByMeldingIdMelder({
          body: { text: formDataObj.primary.toString() },
          path: { melding_id: meldingIdForPatch },
          query: { token: meldingTokenForPatch },
        })
      : await postMelding({ body: { text: formDataObj.primary.toString() } })

  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: handleApiError(error) }],
    }
  }

  if (error) return { formData, systemError: error }

  const { classification, created_at, id, public_id, token } = data

  const meldingData = {
    classificationId: classification?.id,
    createdAt: created_at,
    id,
    publicId: public_id,
    token,
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
