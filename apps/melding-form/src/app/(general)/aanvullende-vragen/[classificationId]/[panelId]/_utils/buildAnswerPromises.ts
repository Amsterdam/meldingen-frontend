import { postMeldingByMeldingIdQuestionByQuestionId } from '@meldingen/api-client'

export const buildAnswerPromises = (
  entries: [string, string | File][],
  questionKeysAndIds: { key: string; id: number }[],
  meldingId: string,
  token: string,
) =>
  entries.map(([key, value]) => {
    if (value instanceof File) return undefined

    // Filter out empty answers
    if (value.length === 0) return undefined

    const questionId = questionKeysAndIds.find((component) => component.key === key)?.id

    if (!questionId) return undefined

    return postMeldingByMeldingIdQuestionByQuestionId({
      body: { text: value },
      path: {
        melding_id: parseInt(meldingId, 10),
        question_id: questionId,
      },
      query: { token },
    }).then((results) => {
      return {
        key: key,
        value: results,
      }
    })
  })
