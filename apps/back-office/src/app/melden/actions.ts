'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import type { MeldingOutput } from '@meldingen/api-client'

import type { MeldingData } from './types'

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
  const t = await getTranslations('melding-form')

  const formDataObj = Object.fromEntries(formData)

  // Return validation errors if required fields are missing
  const validationErrors = [
    ...(!formDataObj.primary ? [{ key: 'primary', message: requiredErrorMessage }] : []),
    ...(!formDataObj.source ? [{ key: 'source', message: t('source.error') }] : []),
  ]

  if (validationErrors.length > 0) {
    return { formData, validationErrors }
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

  const { error: updateMeldingError } = await patchMeldingByMeldingId({
    body: {
      label_ids: formData.getAll('labels').map((label) => Number(label)),
      source_id: Number(formDataObj.source),
      urgency: urgencyNumber,
    },
    path: { melding_id: meldingData.id },
  })

  if (updateMeldingError) return { formData, systemError: updateMeldingError }

  const params = new URLSearchParams({
    created_at: meldingData.createdAt,
    id: String(meldingData.id),
    public_id: meldingData.publicId,
    token: meldingData.token,
  })

  if (meldingData.classificationId) params.set('classification_id', String(meldingData.classificationId))

  redirect(`${process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL}/back-office-entry?${params}`)
}
