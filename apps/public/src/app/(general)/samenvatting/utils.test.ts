import { http, HttpResponse } from 'msw'

import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingData,
  getPrimaryFormSummary,
} from './utils'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import mockAdditionalQuestionsAnswerData from 'apps/public/src/mocks/mockAdditionalQuestionsAnswerData.json'
import mockMeldingData from 'apps/public/src/mocks/mockMeldingData.json'
import { server } from 'apps/public/src/mocks/node'

import { Blob } from 'buffer'

const mockMeldingId = '88'
const mockToken = 'test-token'

describe('getMeldingData', () => {
  it('should return correct melding summary', async () => {
    const result = await getMeldingData(mockMeldingId, mockToken)

    expect(result).toEqual({ data: mockMeldingData })
  })

  it('should return an error message when error is returned', async () => {
    server.use(http.get(ENDPOINTS.MELDING_BY_ID, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })))

    const result = await getMeldingData(mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an error message when melding data is not found', async () => {
    server.use(http.get(ENDPOINTS.MELDING_BY_ID, () => new HttpResponse()))

    const result = await getMeldingData(mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Melding data not found' })
  })
})

describe('getPrimaryFormSummary', () => {
  it('should return correct primary form summary', async () => {
    const result = await getPrimaryFormSummary('Er ligt hier veel afval op straat.')

    expect(result).toEqual({
      data: {
        key: 'primary',
        term: 'First question',
        description: ['Er ligt hier veel afval op straat.'],
      },
    })
  })

  it('should return an error message when getStaticForm returns an error', async () => {
    server.use(http.get(ENDPOINTS.STATIC_FORM, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })))

    const result = await getPrimaryFormSummary('')

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an error message when getStaticForm does not return data', async () => {
    server.use(http.get(ENDPOINTS.STATIC_FORM, () => new HttpResponse()))

    const result = await getPrimaryFormSummary('')

    expect(result).toEqual({ error: 'Static forms data not found' })
  })

  it('should return an error message when primary form id is not found', async () => {
    server.use(
      http.get(ENDPOINTS.STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-primary',
          },
        ]),
      ),
    )

    const result = await getPrimaryFormSummary('')

    expect(result).toEqual({ error: 'Primary form id not found' })
  })

  it('should return an error message when getStaticFormByStaticFormId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getPrimaryFormSummary('')

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an error message when getStaticFormByStaticFormId does not return data', async () => {
    server.use(http.get(ENDPOINTS.STATIC_FORM_BY_STATIC_FORM_ID, () => new HttpResponse()))

    const result = await getPrimaryFormSummary('')

    expect(result).toEqual({ error: 'Primary form data not found' })
  })
})

describe('getAdditionalQuestionsSummary', () => {
  it('should return correct additional questions summary', async () => {
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    const additionalQuestions = mockAdditionalQuestionsAnswerData.map((item) => ({
      key: item.question.id,
      term: item.question.text,
      description: [item.text],
    }))

    expect(result).toEqual({ data: additionalQuestions })
  })

  it('should return an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.MELDING_ANSWERS_BY_ID_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an empty array when additional questions data is not found', async () => {
    server.use(http.get(ENDPOINTS.MELDING_ANSWERS_BY_ID_MELDER, () => new HttpResponse()))

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    expect(result).toEqual({ data: [] })
  })
})

describe('getAttachmentSummary', () => {
  it('should return correct attachment summary', async () => {
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

  it('should return an error message when getMeldingByMeldingIdAttachmentsMelder returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.MELDING_BY_ID_ATTACHMENTS_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an error message when getMeldingByMeldingIdAttachmentsMelder returns no data', async () => {
    server.use(http.get(ENDPOINTS.MELDING_BY_ID_ATTACHMENTS_MELDER, () => new HttpResponse()))

    const result = await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Attachments data not found' })
  })

  it('should return an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.MELDING_BY_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns an error', async () => {
    server.use(http.get(ENDPOINTS.MELDING_BY_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () => new HttpResponse()))

    const result = await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    expect(result).toEqual({ error: 'Attachment data not found' })
  })
})

describe('getLocationSummary', () => {
  it('should return correct location summary', () => {
    const mockLocation = JSON.stringify({
      name: 'Nieuwmarkt 23, 1011JS Amsterdam',
      coordinates: { lat: 52.372314346390816, lng: 4.900889396667481 },
    })
    const result = getLocationSummary('Waar staat de container?', mockLocation)

    expect(result).toEqual({
      key: 'location',
      term: 'Waar staat de container?',
      description: ['Nieuwmarkt 23, 1011JS Amsterdam'],
    })
  })

  it('should return error message when location cookie could not be parsed', () => {
    const result = getLocationSummary('Waar staat de container?')

    expect(result).toEqual({
      key: 'location',
      term: 'Waar staat de container?',
      description: ['Er konden geen locatiegegevens worden gevonden.'],
    })
  })
})

describe('getContactSummary', () => {
  it('should return correct contact summary', () => {
    const result = getContactSummary('Wat zijn uw contactgegevens?', 'test@test.com', '+31612345678')

    expect(result).toEqual({
      key: 'contact',
      term: 'Wat zijn uw contactgegevens?',
      description: ['test@test.com', '+31612345678'],
    })
  })

  it('should return undefined when contact details are not filled in', () => {
    const result = getContactSummary('Wat zijn uw contactgegevens?')

    expect(result).toEqual(undefined)
  })
})
