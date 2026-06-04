import type { MeldingOutput } from '@meldingen/api-client'

import { getLocationSummary } from './getLocationSummary'
import { melding } from '~/mocks/data'

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
