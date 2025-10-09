import { http, HttpResponse } from 'msw'

import type { MeldingOutput } from '@meldingen/api-client'

import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
  getContactSummary,
  getLocationSummary,
  getPrimaryFormSummary,
} from './utils'
import { additionalQuestions, melding } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

import { Blob } from 'buffer'

const mockMeldingId = '88'
const mockToken = 'test-token'
const mockClassificationId = 1

describe('getPrimaryFormSummary', () => {
  it('returns correct primary form summary', async () => {
    const result = await getPrimaryFormSummary('Er ligt hier veel afval op straat.')

    expect(result).toEqual({
      data: {
        key: 'primary',
        term: 'First question',
        description: 'Er ligt hier veel afval op straat.',
      },
    })
  })

  it('returns an error message when getStaticForm returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json('Error message', { status: 500 })))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('returns an error message when getStaticForm does not return data', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => new HttpResponse()))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Static forms data not found.')
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

  it('returns an error message when getStaticFormByStaticFormId does not return data', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => new HttpResponse()))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Primary form data not found.')
  })
})

describe('getAdditionalQuestionsSummary', () => {
  it('returns correct additional questions summary', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              key: 'page1',
              components: [{ question: 35 }, { question: 36 }],
            },
          ],
        }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      key: item.question.id.toString(),
      term: item.question.text,
      description: item.text,
      link: '/aanvullende-vragen/1/page1',
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

  it('returns an empty array when additional questions data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () => new HttpResponse()))

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({ data: [] })
  })

  it('returns links to home if panelId is not found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              key: 'page1',
              components: [{ question: 999 }, { question: 998 }],
            },
          ],
        }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      key: item.question.id.toString(),
      term: item.question.text,
      description: item.text,
      link: '/',
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
      data: {
        key: 'attachments',
        term: "Foto's",
        files: [
          {
            blob: expect.any(Blob),
            contentType: 'image/webp',
            fileName: 'IMG_0815.jpg',
          },
        ],
      },
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

  it('returns an error message when getMeldingByMeldingIdAttachmentsMelder returns no data', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () => new HttpResponse()))

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Attachments data not found.')
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

  it('returns an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns no data', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () => new HttpResponse()),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Attachment download data not found.')
  })
})

describe('getLocationSummary', () => {
  it('returns correct location summary', () => {
    const result = getLocationSummary((key) => key, melding)

    expect(result).toEqual({
      key: 'location',
      term: 'location-label',
      description: 'Oudezijds Voorburgwal 300A, 1012GL Amsterdam',
    })
  })

  it('returns error message when location cookie could not be parsed', () => {
    const result = getLocationSummary((key) => key, {} as MeldingOutput)

    expect(result).toEqual({
      key: 'location',
      term: 'location-label',
      description: 'errors.no-location',
    })
  })
})

describe('getContactSummary', () => {
  it('returns correct contact summary', () => {
    const result = getContactSummary('Wat zijn uw contactgegevens?', 'test@test.com', '+31612345678')

    expect(result).toEqual({
      key: 'contact',
      term: 'Wat zijn uw contactgegevens?',
      description: ['test@test.com', '+31612345678'],
    })
  })

  it('returns undefined when contact details are not filled in', () => {
    const result = getContactSummary('Wat zijn uw contactgegevens?')

    expect(result).toEqual(undefined)
  })
})
