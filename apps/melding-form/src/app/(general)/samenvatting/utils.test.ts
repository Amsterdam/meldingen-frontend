import { Blob } from 'buffer'
import { http, HttpResponse } from 'msw'

import type { MeldingOutput } from '@meldingen/api-client'

import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingData,
  getPrimaryFormSummary,
} from './utils'
import { additionalQuestions, melding } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const mockMeldingId = '88'
const mockToken = 'test-token'
const mockClassificationId = 1

describe('getMeldingData', () => {
  it('should return correct melding summary', async () => {
    const result = await getMeldingData(mockMeldingId, mockToken)

    expect(result).toEqual(melding)
  })

  it('should return an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json('Error message', { status: 500 })),
    )

    const testFunction = async () => await getMeldingData(mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch melding data.')
  })
})

describe('getPrimaryFormSummary', () => {
  it('returns correct primary form summary', async () => {
    const result = await getPrimaryFormSummary('Er ligt hier veel afval op straat.')

    expect(result).toEqual({
      data: {
        description: 'Er ligt hier veel afval op straat.',
        key: 'primary',
        term: 'First question',
      },
    })
  })

  it('returns an error message when getStaticForm returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json('Error message', { status: 500 })))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('returns an error message when primary form id is not found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-primary',
          },
        ]),
      ),
    )

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Primary form id not found.')
  })

  it('returns an error message when getStaticFormByStaticFormId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch primary form data.')
  })
})

describe('getAdditionalQuestionsSummary', () => {
  it('returns correct additional questions summary', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [{ question: 35 }, { question: 36 }],
              key: 'page1',
            },
          ],
        }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      description: item.text,
      key: item.question.id.toString(),
      link: '/aanvullende-vragen/1/page1',
      term: item.question.text,
    }))

    expect(result).toEqual({ data: additionalQuestionsSummary })
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
            },
          ],
        }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      description: item.text,
      key: item.question.id.toString(),
      link: '/',
      term: item.question.text,
    }))

    expect(result).toEqual({ data: additionalQuestionsSummary })
  })

  it('returns an empty array when classificationId is not provided', async () => {
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    expect(result).toEqual({ data: [] })
  })

  it('returns an error message when getFormClassificationByClassificationId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const testFunction = async () => await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    await expect(testFunction).rejects.toThrowError('Failed to fetch form by classification.')
  })

  it("returns an empty array when the error is 'Not Found'", async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({ detail: 'Not Found' }, { status: 500 }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({ data: [] })
  })
})

describe('getAttachmentSummary', () => {
  it('returns correct attachment summary', async () => {
    const result = await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    expect(result).toMatchObject({
      files: [
        {
          blob: expect.any(Blob),
          fileName: 'IMG_0815.jpg',
        },
      ],
      key: 'attachments',
      term: "Foto's",
    })
  })

  it('returns an error message when getMeldingByMeldingIdAttachmentsMelder returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch attachments data.')
  })

  it('returns an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch attachment download.')
  })
})

describe('getLocationSummary', () => {
  it('returns correct location summary', () => {
    const result = getLocationSummary((key) => key, melding)

    expect(result).toEqual({
      description: 'Oudezijds Voorburgwal 300A, 1012GL Amsterdam',
      key: 'location',
      term: 'location-label',
    })
  })

  it('returns error message when melding does not have an address', () => {
    const result = getLocationSummary((key) => key, {} as MeldingOutput)

    expect(result).toEqual({
      description: 'errors.no-location',
      key: 'location',
      term: 'location-label',
    })
  })
})

describe('getContactSummary', () => {
  it('returns correct contact summary', () => {
    const result = getContactSummary('Wat zijn uw contactgegevens?', 'test@test.com', '+31612345678')

    expect(result).toEqual({
      description: ['test@test.com', '+31612345678'],
      key: 'contact',
      term: 'Wat zijn uw contactgegevens?',
    })
  })

  it('returns undefined when contact details are not filled in', () => {
    const result = getContactSummary('Wat zijn uw contactgegevens?')

    expect(result).toEqual(undefined)
  })
})
