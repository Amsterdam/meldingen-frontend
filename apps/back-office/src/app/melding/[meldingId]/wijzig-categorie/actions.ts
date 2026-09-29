'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import type { FormState } from '~/types'

import { REASON_COUNT_MAX_LENGTH } from './constants'
import { postMeldingByMeldingIdReclassification } from '~/app/_api-client/proxy'

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
  const classificationId = formDataObj['classificationId'] ? Number(formDataObj['classificationId']) : undefined
  const classificationQuery = (formDataObj['classificationQuery'] as string | undefined) ?? ''
  const reason = (formDataObj.reason as string | undefined) ?? ''

  const validationErrors = []

  if (!classificationQuery) {
    validationErrors.push({ key: 'classificationId', message: t('classification-required') })
  } else if (!classificationId) {
    validationErrors.push({ key: 'classificationId', message: t('classification-does-not-exist') })
  } else if (classificationId === currentClassificationId) {
    validationErrors.push({ key: 'classificationId', message: t('classification-same') })
  }

  if (!reason) {
    validationErrors.push({ key: 'reason', message: t('reason-required') })
  }

  if (reason.length > REASON_COUNT_MAX_LENGTH) {
    validationErrors.push({ key: 'reason', message: t('reason-max-length', { max: REASON_COUNT_MAX_LENGTH }) })
  }

  if (validationErrors.length > 0) {
    return { formData, validationErrors }
  }

  const { error } = await postMeldingByMeldingIdReclassification({
    body: {
      classification_id: classificationId,
      reason,
    },
    path: { melding_id: meldingId },
  })

  if (error) return { apiError: error, formData }

  return redirect(redirectPath)
}
