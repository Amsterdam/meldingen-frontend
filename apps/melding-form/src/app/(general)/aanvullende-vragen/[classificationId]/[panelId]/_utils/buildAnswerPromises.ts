import {
  patchMeldingByMeldingIdAnswerByAnswerId,
  postMeldingByMeldingIdQuestionByQuestionId,
} from '@meldingen/api-client'

const patchAnswer = (answerId: number, meldingId: string, token: string, value: string, key: string) =>
  patchMeldingByMeldingIdAnswerByAnswerId({
    body: { text: value },
    path: {
      answer_id: answerId,
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  }).then((results) => ({ key, value: results }))

const postAnswer = (questionId: number, meldingId: string, token: string, value: string, key: string) =>
  postMeldingByMeldingIdQuestionByQuestionId({
    body: { text: value },
    path: {
      melding_id: parseInt(meldingId, 10),
      question_id: questionId,
    },
    query: { token },
  }).then((results) => ({ key, value: results }))

export const buildAnswerPromises = (
  entries: [string, string | File][],
  meldingId: string,
  questionKeysAndIds: { key: string; id: number }[],
  token: string,
  questionAndAnswerIdPairs?: { answerId: number; questionId: number }[],
) =>
  entries.map(([key, value]) => {
    // Do not handle files or empty answers
    if (value instanceof File || value.length === 0) return undefined

    const questionId = questionKeysAndIds.find((component) => component.key === key)?.id

    if (!questionId) return undefined

    const answerId = questionAndAnswerIdPairs?.find((item) => item.questionId === questionId)?.answerId

    if (answerId) {
      return patchAnswer(answerId, meldingId, token, value, key)
    }

    return postAnswer(questionId, meldingId, token, value, key)
  })
