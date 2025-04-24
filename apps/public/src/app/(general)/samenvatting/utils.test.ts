import {
  getAdditionalQuestionsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingData,
  getPrimaryFormSummary,
} from './utils'

const mockMeldingId = '88'
const mockToken = 'test-token'

describe('getMeldingData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should return correct melding summary', async () => {
    const result = await getMeldingData(mockMeldingId, mockToken)

    expect(result).toEqual({
      id: 123,
      created_at: '2025-02-18T10:34:29.103642',
      updated_at: '2025-02-18T10:34:40.730569',
      text: 'Alles',
      state: 'questions_answered',
      classification: null,
      geo_location: null,
      email: 'email@email.email',
      phone: '0612345678',
    })
  })
})

describe('getPrimaryFormSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should return correct melding summary', async () => {
    const result = await getPrimaryFormSummary('Er ligt hier veel afval op straat.')

    expect(result).toEqual({
      key: 'primary',
      term: 'First question',
      description: ['Er ligt hier veel afval op straat.'],
    })
  })
})

describe('getAdditionalQuestionsSummary', () => {
  it('should return correct addtional questions summary', async () => {
    const result = await getAdditionalQuestionsSummary(mockMeldingId, mockToken)

    expect(result).toEqual([
      { key: '35', term: 'Wat wilt u melden?', description: ['q1'] },
      { key: '36', term: 'Text Field', description: ['q2'] },
    ])
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
