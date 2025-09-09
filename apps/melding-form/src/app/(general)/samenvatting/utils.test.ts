import { http, HttpResponse } from 'msw'

import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
  getContactSummary,
  getLocationSummary,
  getPrimaryFormSummary,
} from './utils'
import { additionalQuestions } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

import { Blob } from 'buffer'

const mockMeldingId = '88'
const mockToken = 'test-token'
const mockClassificationId = 1

describe('getPrimaryFormSummary', () => {
  it('should return correct primary form summary', async () => {
    const result = await getPrimaryFormSummary('Er ligt hier veel afval op straat.')

    expect(result).toEqual({
      data: {
        key: 'primary',
        term: 'First question',
        description: 'Er ligt hier veel afval op straat.',
      },
    })
  })

  it('should return an error message when getStaticForm returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json('Error message', { status: 500 })))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('should return an error message when getStaticForm does not return data', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => new HttpResponse()))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Static forms data not found.')
  })

  it('should return an error message when primary form id is not found', async () => {
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

  it('should return an error message when getStaticFormByStaticFormId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch primary form data.')
  })

  it('should return an error message when getStaticFormByStaticFormId does not return data', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => new HttpResponse()))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Primary form data not found.')
  })
})

describe('getAdditionalQuestionsSummary', () => {
  it('should return correct additional questions summary', async () => {
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

  it('should return an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const testFunction = async () => await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    await expect(testFunction).rejects.toThrowError('Failed to fetch additional questions data.')
  })

  it('should return an empty array when additional questions data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () => new HttpResponse()))

    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    expect(result).toEqual({ data: [] })
  })

  it('should return links to home if panelId is not found', async () => {
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

  it('should return an empty array when classificationId is not provided', async () => {
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    expect(result).toEqual({ data: [] })
  })

  it('should return an error message when getFormClassificationByClassificationId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const testFunction = async () => await getAdditionalQuestionsSummary(mockMeldingId, mockToken, mockClassificationId)

    await expect(testFunction).rejects.toThrowError('Failed to fetch form by classification.')
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
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch attachments data.')
  })

  it('should return an error message when getMeldingByMeldingIdAttachmentsMelder returns no data', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () => new HttpResponse()))

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Attachments data not found.')
  })

  it('should return an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch attachment download.')
  })

  it('should return an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns no data', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () => new HttpResponse()),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Attachment download data not found.')
  })
})

describe('getLocationSummary', () => {
  it('should return correct location summary', () => {
    const mockLocation = JSON.stringify({
      name: 'Nieuwmarkt 23, 1011JS Amsterdam',
      coordinates: { lat: 52.372314346390816, lng: 4.900889396667481 },
    })
    const result = getLocationSummary((key) => key, mockLocation)

    expect(result).toEqual({
      key: 'location',
      term: 'location-label',
      description: 'Nieuwmarkt 23, 1011JS Amsterdam',
    })
  })

  it('should return error message when location cookie could not be parsed', () => {
    const result = getLocationSummary((key) => key)

    expect(result).toEqual({
      key: 'location',
      term: 'location-label',
      description: 'errors.no-location',
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
