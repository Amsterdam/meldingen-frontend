import { Blob } from 'buffer'
import { http, HttpResponse } from 'msw'

import { getFullNLAddress } from '../../utils'
import {
  getAdditionalQuestionsData,
  getAttachmentsData,
  getContactData,
  getLocationData,
  getMeldingData,
} from './utils'
import { additionalTimeQuestion, additionalValueLabelQuestion, melding } from 'apps/back-office/src/mocks/data'
import { additionalQuestions } from 'apps/back-office/src/mocks/data'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

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

describe('getContactData', () => {
  it('returns correct contact data', () => {
    const result = getContactData(melding, (key: string) => key)

    expect(result).toEqual([
      {
        description: melding.email,
        key: 'email',
        term: 'detail.contact.email',
      },
      {
        description: melding.phone,
        key: 'phone',
        term: 'detail.contact.phone',
      },
    ])
  })

  it('returns a fallback label when contact data does not exist', () => {
    const meldingDataWithoutContact = {
      ...melding,
      email: null,
      phone: null,
    }

    const result = getContactData(meldingDataWithoutContact, (key: string) => key)

    expect(result).toEqual([
      {
        description: 'detail.contact.no-data',
        key: 'email',
        term: 'detail.contact.email',
      },
      {
        description: 'detail.contact.no-data',
        key: 'phone',
        term: 'detail.contact.phone',
      },
    ])
  })
})

describe('getLocationData', () => {
  it('returns correct location data', () => {
    const result = getLocationData(melding, (key: string) => key)

    expect(result).toEqual([
      {
        description: getFullNLAddress(melding),
        key: 'address',
        term: 'detail.location.address',
      },
    ])
  })

  it('returns undefined when not all location data exists', () => {
    const meldingDataWithoutPostalCode = {
      ...melding,
      postal_code: null,
    }

    const result = getLocationData(meldingDataWithoutPostalCode, (key: string) => key)

    expect(result).toEqual(undefined)
  })
})

describe('getMeldingData', () => {
  it('returns correct melding summary', () => {
    const result = getMeldingData(melding, (key: string) => key)

    const { classification, created_at, id } = melding

    expect(result).toEqual([
      {
        description: new Date(created_at).toLocaleDateString('nl-NL'),
        key: 'created_at',
        term: 'detail.melding-data.created_at',
      },
      {
        description: classification!.name,
        key: 'classification',
        term: 'detail.melding-data.classification',
      },
      {
        description: 'shared.state.questions_answered',
        key: 'state',
        link: {
          href: `/melding/${id}/wijzig-status`,
          label: 'detail.melding-data.state.link',
        },
        term: 'detail.melding-data.state.term',
      },
    ])
  })

  it('returns correct melding summary when classification is null', () => {
    const meldingDataWithoutClassification = {
      ...melding,
      classification: null,
    }

    const result = getMeldingData(meldingDataWithoutClassification, (key: string) => key)

    expect(result).toEqual([
      {
        description: new Date(melding.created_at).toLocaleDateString('nl-NL'),
        key: 'created_at',
        term: 'detail.melding-data.created_at',
      },
      {
        description: 'detail.no-classification',
        key: 'classification',
        term: 'detail.melding-data.classification',
      },
      {
        description: 'shared.state.questions_answered',
        key: 'state',
        link: {
          href: `/melding/${melding.id}/wijzig-status`,
          label: 'detail.melding-data.state.link',
        },
        term: 'detail.melding-data.state.term',
      },
    ])
  })
})

describe('getAttachmentsData', () => {
  it('returns correct attachments data', async () => {
    const result = await getAttachmentsData(mockMeldingId, (key: string) => key)

    expect(result).toMatchObject({
      files: [
        {
          blob: expect.any(Blob),
          fileName: 'IMG_0815.jpg',
        },
      ],
      key: 'attachments',
      term: 'detail.attachments.title',
    })
  })

  it('returns an error message when getMeldingByMeldingIdAttachments returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getAttachmentsData(mockMeldingId, (key: string) => key)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('returns an attachment with error message when getAttachmentById returns an error ', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
    )

    const result = await getAttachmentsData(mockMeldingId, (key: string) => key)

    expect(result).toMatchObject({
      files: [
        {
          blob: null,
          error: 'Error message',
          fileName: 'IMG_0815.jpg',
        },
      ],
      key: 'attachments',
      term: 'detail.attachments.title',
    })
  })
})
