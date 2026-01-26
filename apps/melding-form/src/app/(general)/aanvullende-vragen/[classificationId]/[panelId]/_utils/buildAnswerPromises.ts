import {
  patchMeldingByMeldingIdAnswerByAnswerId,
  postMeldingByMeldingIdQuestionByQuestionId,
  PostMeldingByMeldingIdQuestionByQuestionIdData,
} from '@meldingen/api-client'

type ValueAndLabel = {
  label: string
  value: string
}

const getAnswerBody = (
  formioType: string,
  value: string | string[],
  valuesAndLabels?: ValueAndLabel[],
): PostMeldingByMeldingIdQuestionByQuestionIdData['body'] => {
  // Handle checkbox values, which are passed as an array
  if (Array.isArray(value)) {
    const valuesAndLabelsForCheckboxes = valuesAndLabels?.filter((valAndLabel) => value.includes(valAndLabel.value))

    if (!valuesAndLabelsForCheckboxes) return { text: value[0], type: 'text' } // TODO

    return { type: 'value_label', values_and_labels: valuesAndLabelsForCheckboxes }
  }

  switch (formioType) {
    case 'radio':
    case 'select': {
      const valueAndLabel = valuesAndLabels?.find((valAndLabel) => valAndLabel.value === value)

      if (!valueAndLabel) return { text: value[0], type: 'text' } // TODO

      return { type: 'value_label', values_and_labels: [valueAndLabel] }
    }
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

const patchAnswer = ({ answerId, key, meldingId, token, type, value, valuesAndLabels }: PatchAnswerParams) =>
  patchMeldingByMeldingIdAnswerByAnswerId({
    body: getAnswerBody(type, value, valuesAndLabels),
    path: {
      answer_id: answerId,
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  }).then((results) => ({ key, value: results }))

type PostAnswerParams = AnswerParams & { questionId: number; valuesAndLabels?: { label: string; value: string }[] }

const postAnswer = ({ key, meldingId, questionId, token, type, value, valuesAndLabels }: PostAnswerParams) =>
  postMeldingByMeldingIdQuestionByQuestionId({
    body: getAnswerBody(type, value, valuesAndLabels),
    path: {
      melding_id: parseInt(meldingId, 10),
      question_id: questionId,
    },
    query: { token },
  }).then((results) => ({ key, value: results })) // TODO: do we need this?

export const buildAnswerPromises = (
  entries: [string, string | string[]][],
  meldingId: string,
  questionMetadata: { id: number; key: string; type: string; valuesAndLabels?: { label: string; value: string }[] }[],
  token: string,
  questionAndAnswerIdPairs?: { answerId: number; questionId: number }[],
) =>
  entries.map(([key, value]) => {
    // Do not handle empty answers
    if (value.length === 0) return undefined

    const questionId = questionMetadata.find((component) => component.key === key)?.id
    const type = questionMetadata.find((component) => component.key === key)?.type

    if (!questionId || !type) return undefined

    const answerId = questionAndAnswerIdPairs?.find((item) => item.questionId === questionId)?.answerId
    const valuesAndLabels = questionMetadata.find((component) => component.key === key)?.valuesAndLabels

    // If an answerId exists, it is an existing answer
    if (answerId) {
      return patchAnswer({ answerId, key, meldingId, token, type, value, valuesAndLabels })
    }

    return postAnswer({ key, meldingId, questionId, token, type, value, valuesAndLabels })
  })
