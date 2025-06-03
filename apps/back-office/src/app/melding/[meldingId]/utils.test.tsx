import { http, HttpResponse } from 'msw'

import { getAdditionalQuestionsData, getContactData, getLocationData, getMeldingData } from './utils'
import { getFullNLAddress } from '../../utils'
import { melding } from 'apps/back-office/src/mocks/data'
import { additionalQuestions } from 'apps/back-office/src/mocks/data'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

const mockMeldingId = 88

describe('getAdditionalQuestionsData', () => {
  it('should return correct additional questions data', async () => {
    const result = await getAdditionalQuestionsData(mockMeldingId)

    const additionalQuestionsData = additionalQuestions.map((item) => ({
      key: item.question.id.toString(),
      term: item.question.text,
      description: item.text,
    }))

    expect(result).toEqual({ data: additionalQuestionsData })
  })

  it('should return an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )
    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('should return an empty array when additional questions data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () => new HttpResponse()))

    const result = await getAdditionalQuestionsData(mockMeldingId)

    expect(result).toEqual({ data: [] })
  })
})

describe('getContactData', () => {
  it('should return correct contact data', () => {
    const result = getContactData(melding, (key: string) => key)

    expect(result).toEqual([
      {
        description: melding.email,
        key: 'email',
        term: 'contact.email',
      },
      {
        description: melding.phone,
        key: 'phone',
        term: 'contact.phone',
      },
    ])
  })

  it('should return undefined when contact data does not exist', () => {
    const meldingDataWithoutContact = {
      ...melding,
      email: null,
      phone: null,
    }

    const result = getContactData(meldingDataWithoutContact, (key: string) => key)

    expect(result).toEqual(undefined)
  })
})

describe('getMeldingData', () => {
  it('should return correct melding summary', () => {
    const result = getMeldingData(melding, (key: string) => key)

    const { id, classification, created_at, state } = melding

    expect(result).toEqual([
      {
        description: new Date(created_at).toLocaleDateString('nl-NL'),
        key: 'created_at',
        term: 'melding-data.created_at',
      },
      {
        description: classification!.name,
        key: 'classification',
        term: 'melding-data.classification',
      },
      {
        description: state,
        key: 'state',
        link: {
          href: `/melding/${id}/wijzig-status`,
          label: 'melding-data.state.link',
        },
        term: 'melding-data.state.term',
      },
    ])
  })

  it('should return correct melding summary when classification is null', () => {
    const meldingDataWithoutClassification = {
      ...melding,
      classification: null,
    }

    const result = getMeldingData(meldingDataWithoutClassification, (key: string) => key)

    expect(result).toEqual([
      {
        description: new Date(melding.created_at).toLocaleDateString('nl-NL'),
        key: 'created_at',
        term: 'melding-data.created_at',
      },
      {
        description: 'no-classification',
        key: 'classification',
        term: 'melding-data.classification',
      },
      {
        description: melding.state,
        key: 'state',
        link: {
          href: `/melding/${melding.id}/wijzig-status`,
          label: 'melding-data.state.link',
        },
        term: 'melding-data.state.term',
      },
    ])
  })
})

describe('getLocationData', () => {
  it('should return correct location data', () => {
    const result = getLocationData(melding, (key: string) => key)

    expect(result).toEqual([
      {
        key: 'address',
        term: 'location.address',
        description: getFullNLAddress(melding),
      },
    ])
  })
})
