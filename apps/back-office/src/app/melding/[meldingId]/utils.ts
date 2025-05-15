import { getMeldingByMeldingIdAnswers } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

export const getAdditionalQuestions = async (meldingId: number) => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  return {
    data:
      data?.map((answer) => ({
        key: `${answer.question.id}`,
        term: answer.question.text,
        description: answer.text,
      })) || [],
  }
}
