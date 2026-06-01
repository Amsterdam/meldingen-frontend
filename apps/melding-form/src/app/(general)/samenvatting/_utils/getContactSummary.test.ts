import { getContactSummary } from './getContactSummary'

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
