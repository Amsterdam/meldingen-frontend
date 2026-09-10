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

export const postChangeCategoryForm = async (
  { currentClassificationId, meldingId }: MeldingIdParam,
  _: unknown,
  formData: FormData,
): Promise<FormState> => {
  const t = await getTranslations('change-category.errors')
  const redirectPath = `/melding/${meldingId}`

  const formDataObj = Object.fromEntries(formData)
  const category = formDataObj['category'] as string | undefined
  const reason = (formDataObj.reason as string | undefined) ?? ''

  const validationErrors = [
    ...(!category ? [{ key: 'category', message: t('category-required') }] : []),
    ...(category === String(currentClassificationId) ? [{ key: 'category', message: t('category-same') }] : []),
    ...(!reason ? [{ key: 'reason', message: t('reason-required') }] : []),
    ...(reason.length > REASON_COUNT_MAX_LENGTH
      ? [{ key: 'reason', message: t('reason-max-length', { max: REASON_COUNT_MAX_LENGTH }) }]
      : []),
  ]

  if (validationErrors.length > 0) {
    return { formData, validationErrors }
  }

  const parsedCategoryId = Number(category)
  if (!Number.isInteger(parsedCategoryId)) {
    return { formData, validationErrors: [{ key: 'category', message: t('category-required') }] }
  }

  const { error } = await postMeldingByMeldingIdReclassification({
    body: {
      classification_id: parsedCategoryId,
      reason,
    },
    path: { melding_id: meldingId },
  })

  if (error) {
    return {
      apiError: error,
      validationErrors,
    }
  }

  return redirect(redirectPath)
}
