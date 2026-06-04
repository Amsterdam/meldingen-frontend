import { http, HttpResponse } from 'msw'

import { getAdditionalQuestionsData } from './getAdditionalQuestionsData'
import { additionalQuestions, additionalTimeQuestion, additionalValueLabelQuestion } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 88

describe('getAdditionalQuestionsData', () => {
  it('returns correct additional text question data', async () => {
    const result = await getAdditionalQuestionsData(mockMeldingId)

    const additionalQuestionsData = additionalQuestions.map((item) => ({
      description: item.text,
      key: item.question.id.toString(),
      term: item.question.text,
    }))

    expect(result).toEqual({ data: additionalQuestionsData })
  })

  it('returns correct additional time question data', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () => HttpResponse.json([additionalTimeQuestion])))

    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({
      data: [
        {
          description: additionalTimeQuestion.time,
          key: additionalTimeQuestion.question.id.toString(),
          term: additionalTimeQuestion.question.text,
        },
      ],
    })
  })

  it('returns "Weet ik niet" for additional time questions when time is null', async () => {
    const additionalTimeQuestionWithNullTime = {
      ...additionalTimeQuestion,
      time: null,
    }

    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () =>
        HttpResponse.json([additionalTimeQuestionWithNullTime]),
      ),
    )

    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({
      data: [
        {
          description: 'Weet ik niet',
          key: additionalTimeQuestionWithNullTime.question.id.toString(),
          term: additionalTimeQuestionWithNullTime.question.text,
        },
      ],
    })
  })

  it('returns correct additional value_label question data', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () => HttpResponse.json([additionalValueLabelQuestion])),
    )

    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({
      data: [
        {
          description: additionalValueLabelQuestion.values_and_labels
            .map((valAndLabel) => valAndLabel.label)
            .join(', '),
          key: additionalValueLabelQuestion.question.id.toString(),
          term: additionalValueLabelQuestion.question.text,
        },
      ],
    })
  })

  it('returns an empty description for unsupported question types', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () =>
        HttpResponse.json([{ question: { id: 3, text: 'Unsupported question type' }, type: 'unsupported_type' }]),
      ),
    )

    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({
      data: [{ description: '', key: '3', term: 'Unsupported question type' }],
    })
  })

  it('returns an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({ error: 'Error message' })
  })
})
