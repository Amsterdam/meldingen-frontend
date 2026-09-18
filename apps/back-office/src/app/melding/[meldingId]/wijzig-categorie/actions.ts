'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import type { FormState } from '~/types'

import { REASON_COUNT_MAX_LENGTH } from './constants'
import {
  getApiErrorMessage,
  hasValidationErrors,
  postMeldingByMeldingIdReclassification,
} from '~/app/_api-client/proxy'

type MeldingIdParam = {
  currentClassificationId?: number
  meldingId: number
}

export const postReclassificationForm = async (
  { currentClassificationId, meldingId }: MeldingIdParam,
  _: unknown,
  formData: FormData,
): Promise<FormState> => {
  const t = await getTranslations('change-category.errors')
  const redirectPath = `/melding/${meldingId}`

  const formDataObj = Object.fromEntries(formData)
  const classification = formDataObj['classification'] as string | undefined
  const reason = (formDataObj.reason as string | undefined) ?? ''

  const validationErrors = [
    ...(!classification ? [{ key: 'category', message: t('classification-required') }] : []),
    ...(classification === String(currentClassificationId)
      ? [{ key: 'classification', message: t('classification-same') }]
      : []),
    ...(!reason ? [{ key: 'reason', message: t('reason-required') }] : []),
    ...(reason.length > REASON_COUNT_MAX_LENGTH
      ? [{ key: 'reason', message: t('reason-max-length', { max: REASON_COUNT_MAX_LENGTH }) }]
      : []),
  ]

  if (validationErrors.length > 0) {
    return { formData, validationErrors }
  }

  const parsedClassificationId = Number(classification)

  const { error, response } = await postMeldingByMeldingIdReclassification({
    body: {
      classification_id: parsedClassificationId,
      reason,
    },
    path: { melding_id: meldingId },
  })

  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: getApiErrorMessage(error) }],
    }
  }

  if (error) return { apiError: error, formData }

  return redirect(redirectPath)
}
