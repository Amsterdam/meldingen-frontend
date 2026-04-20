import { getFormClassificationByClassificationId, putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

import { TOP_ANCHOR_ID } from '../../constants'

type ClassificationRedirectResult = { type: 'redirect'; url: string } | { error: unknown; type: 'error' }

// We've extracted this logic because it's used in Home's action and the Back Office entry route handler,
// and we want to keep the logic consistent between the two places.
// This function determines where to redirect the user after they have submitted the primary form,
// based on whether there are additional questions to answer.
export const resolveClassificationRedirect = async (
  meldingId: number,
  token: string,
  classificationId?: number,
): Promise<ClassificationRedirectResult> => {
  if (classificationId) {
    const { data, error, response } = await getFormClassificationByClassificationId({
      path: { classification_id: classificationId },
    })

    if (error && response?.status !== 404) return { error, type: 'error' }

    const hasAdditionalQuestions = Boolean(data?.components[0])

    if (!hasAdditionalQuestions) {
      const { error } = await putMeldingByMeldingIdAnswerQuestions({
        path: { melding_id: meldingId },
        query: { token },
      })

      if (error) return { error, type: 'error' }

      return { type: 'redirect', url: `/locatie#${TOP_ANCHOR_ID}` }
    }

    const nextFormFirstKey = data?.components[0].key

    return { type: 'redirect', url: `/aanvullende-vragen/${classificationId}/${nextFormFirstKey}#${TOP_ANCHOR_ID}` }
  }

  return { type: 'redirect', url: `/locatie#${TOP_ANCHOR_ID}` }
}
