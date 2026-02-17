import {
  patchMeldingByMeldingIdAnswerByAnswerId,
  postMeldingByMeldingIdQuestionByQuestionId,
  PostMeldingByMeldingIdQuestionByQuestionIdData,
  ValueLabelObject,
} from '@meldingen/api-client'

const getCheckboxAnswerBody = (
  value: string[],
  valuesAndLabels?: ValueLabelObject[],
): PostMeldingByMeldingIdQuestionByQuestionIdData['body'] | undefined => {
  const selectedValuesAndLabels = valuesAndLabels?.filter((valAndLabel) => value.includes(valAndLabel.value))

  if (!selectedValuesAndLabels || selectedValuesAndLabels.length === 0) return undefined

  return { type: 'value_label', values_and_labels: selectedValuesAndLabels }
}

const getValueLabelAnswerBody = (
  value: string,
  valuesAndLabels?: ValueLabelObject[],
): PostMeldingByMeldingIdQuestionByQuestionIdData['body'] | undefined => {
  const selectedValueAndLabel = valuesAndLabels?.find((valAndLabel) => valAndLabel.value === value)

  if (!selectedValueAndLabel) return undefined

  return { type: 'value_label', values_and_labels: [selectedValueAndLabel] }
}

const getAnswerBody = (
  formioType: string,
  value: string | string[],
  valuesAndLabels?: ValueLabelObject[],
): PostMeldingByMeldingIdQuestionByQuestionIdData['body'] | undefined => {
  // Handle checkbox values, which are passed as an array
  if (Array.isArray(value)) {
    return getCheckboxAnswerBody(value, valuesAndLabels)
  }

  switch (formioType) {
    case 'radio':
    case 'select':
      return getValueLabelAnswerBody(value, valuesAndLabels)
    case 'textarea':
    case 'textfield':
      return { text: value, type: 'text' }
    case 'time':
      return { time: value, type: 'time' }
    default:
      return { text: value, type: 'text' }
  }
}

type AnswerParams = {
  key: string
  meldingId: string
  token: string
  type: string
  value: string | string[]
}

type PatchAnswerParams = AnswerParams & { answerId: number; valuesAndLabels?: { label: string; value: string }[] }

const patchAnswer = ({ answerId, key, meldingId, token, type, value, valuesAndLabels }: PatchAnswerParams) => {
  const body = getAnswerBody(type, value, valuesAndLabels)

  if (!body) return undefined

  return patchMeldingByMeldingIdAnswerByAnswerId({
    body,
    path: {
      answer_id: answerId,
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  }).then((results) => ({ key, value: results }))
}

type PostAnswerParams = AnswerParams & { questionId: number; valuesAndLabels?: { label: string; value: string }[] }

const postAnswer = ({ key, meldingId, questionId, token, type, value, valuesAndLabels }: PostAnswerParams) => {
  const body = getAnswerBody(type, value, valuesAndLabels)

  if (!body) return undefined

  return postMeldingByMeldingIdQuestionByQuestionId({
    body,
    path: {
      melding_id: parseInt(meldingId, 10),
      question_id: questionId,
    },
    query: { token },
  }).then((results) => ({ key, value: results }))
}

type BuildAnswerPromisesArgs = {
  entries: [string, string | string[]][]
  meldingId: string
  questionAndAnswerIdPairs?: { answerId: number; questionId: number }[]
  questionMetadata: { id: number; key: string; type: string; valuesAndLabels?: { label: string; value: string }[] }[]
  token: string
}

export const buildAnswerPromises = ({
  entries,
  meldingId,
  questionAndAnswerIdPairs,
  questionMetadata,
  token,
}: BuildAnswerPromisesArgs) =>
  entries.map(([key, value]) => {
    // Do not handle empty answers
    if (value.length === 0) return undefined

    const question = questionMetadata.find((component) => component.key === key)
    if (!question || !question.type || !question.id) return undefined

    const { id: questionId, type, valuesAndLabels } = question

    const answerId = questionAndAnswerIdPairs?.find((item) => item.questionId === questionId)?.answerId

    const params = { key, meldingId, token, type, value, valuesAndLabels }

    // If an answerId exists, it is an existing answer
    return answerId ? patchAnswer({ ...params, answerId }) : postAnswer({ ...params, questionId })
  })
