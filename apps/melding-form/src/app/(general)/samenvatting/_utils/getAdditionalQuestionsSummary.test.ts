import { http, HttpResponse } from 'msw'

import { getAdditionalQuestionsSummary } from './getAdditionalQuestionsSummary'
import { TOP_ANCHOR_ID } from '~/constants'
import { additionalQuestions } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = '88'
const mockToken = 'test-token'
const mockClassificationId = 1

describe('getAdditionalQuestionsSummary', () => {
  it('returns correct additional questions summary', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [{ question: 35 }, { question: 36 }],
              key: 'page1',
              type: 'panel',
            },
          ],
        }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      description: item.text,
      key: item.question.id.toString(),
      link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
      term: item.original_question_text,
    }))

    expect(result).toEqual({ data: additionalQuestionsSummary, staleAnswerIds: [] })
  })

  it('returns an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const testFunction = async () => await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    await expect(testFunction).rejects.toThrowError('Failed to fetch additional questions data.')
  })

  it('returns links to home if panelId is not found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [{ question: 999 }, { question: 998 }],
              key: 'page1',
              type: 'panel',
            },
          ],
        }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      description: item.text,
      key: item.question.id.toString(),
      link: `/#${TOP_ANCHOR_ID}`,
      term: item.original_question_text,
    }))

    expect(result).toEqual({ data: additionalQuestionsSummary, staleAnswerIds: [] })
  })

  it('returns empty data and staleAnswerIds arrays when classificationId is not provided', async () => {
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    expect(result).toEqual({ data: [], staleAnswerIds: [] })
  })

  it('logs an error message when getFormClassificationByClassificationId returns an error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(consoleErrorSpy).toHaveBeenCalledWith({ detail: 'Error message' })

    consoleErrorSpy.mockRestore()
  })

  it("returns empty data and staleAnswerIds arrays when the error is 'Not Found'", async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({ detail: 'Not Found' }, { status: 500 }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({ data: [], staleAnswerIds: [] })
  })

  it('filters out answers with unmet conditions', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [
                { key: 'question-35', question: 35 },
                {
                  conditional: { eq: 'Answer 35', show: false, when: 'question-35' },
                  key: 'question-36',
                  question: 36,
                },
              ],
              key: 'page1',
              type: 'panel',
            },
          ],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([
          {
            id: 100,
            original_question_text: 'Question 35',
            question: { id: 35, text: 'Question 35' },
            text: 'Answer 35',
            type: 'text',
          },
          {
            id: 101,
            original_question_text: 'Question 36',
            question: { id: 36, text: 'Question 36' },
            text: 'Answer 36',
            type: 'text',
          },
        ]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({
      data: [
        {
          description: 'Answer 35',
          key: '35',
          link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
          term: 'Question 35',
        },
      ],
      staleAnswerIds: [101],
    })
  })

  it('supports the date answer type', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ components: [{ question: 37 }], key: 'page1', type: 'panel' }],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([
          {
            date: { label: '2024-06-01' },
            original_question_text: 'Date question',
            question: { id: 37, text: 'Date question' },
            type: 'date',
          },
        ]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({
      data: [
        {
          description: '2024-06-01',
          key: '37',
          link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
          term: 'Date question',
        },
      ],
      staleAnswerIds: [],
    })
  })

  it('supports the time answer type', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ components: [{ question: 37 }], key: 'page1', type: 'panel' }],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([
          {
            original_question_text: 'Time question',
            question: { id: 37, text: 'Time question' },
            time: '14:30',
            type: 'time',
          },
        ]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({
      data: [
        {
          description: '14:30',
          key: '37',
          link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
          term: 'Time question',
        },
      ],
      staleAnswerIds: [],
    })
  })

  it('returns "Weet ik niet" for time questions when time is null', async () => {
    const additionalTimeQuestionWithNullTime = {
      original_question_text: 'Time question',
      question: { id: 37, text: 'Time question' },
      time: null,
      type: 'time',
    }

    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ components: [{ question: 37 }], key: 'page1', type: 'panel' }],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([additionalTimeQuestionWithNullTime]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({
      data: [
        {
          description: 'Weet ik niet',
          key: '37',
          link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
          term: 'Time question',
        },
      ],
      staleAnswerIds: [],
    })
  })

  it('supports the value_label answer type', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ components: [{ question: 38 }], key: 'page1', type: 'panel' }],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([
          {
            original_question_text: 'Value label question',
            question: { id: 38, text: 'Value label question' },
            type: 'value_label',
            values_and_labels: [
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
            ],
          },
        ]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({
      data: [
        {
          description: 'Option 1, Option 2',
          key: '38',
          link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
          term: 'Value label question',
        },
      ],
      staleAnswerIds: [],
    })
  })

  it('returns an empty description for unsupported answer types', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ components: [{ question: 39 }], key: 'page1', type: 'panel' }],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([
          {
            original_question_text: 'Unsupported question',
            question: { id: 39, text: 'Unsupported question' },
            type: 'unsupported_type',
          },
        ]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({
      data: [
        {
          description: '',
          key: '39',
          link: `/aanvullende-vragen/1/page1#${TOP_ANCHOR_ID}`,
          term: 'Unsupported question',
        },
      ],
      staleAnswerIds: [],
    })
  })

  it('collects ids of every answer whose question condition is unmet', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [
                { key: 'question-35', question: 35 },
                {
                  conditional: { eq: 'Answer 35', show: false, when: 'question-35' },
                  key: 'question-36',
                  question: 36,
                },
                {
                  conditional: { eq: 'Answer 35', show: false, when: 'question-35' },
                  key: 'question-37',
                  question: 37,
                },
              ],
              key: 'page1',
              type: 'panel',
            },
          ],
        }),
      ),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json([
          { id: 200, question: { id: 35, text: 'Question 35' }, text: 'Answer 35', type: 'text' },
          { id: 201, question: { id: 36, text: 'Question 36' }, text: 'Answer 36', type: 'text' },
          { id: 202, question: { id: 37, text: 'Question 37' }, text: 'Answer 37', type: 'text' },
        ]),
      ),
    )

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result.staleAnswerIds).toEqual([201, 202])
    expect(result.data).toHaveLength(1)
  })
})
