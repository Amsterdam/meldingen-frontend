import { getLocationData } from './getLocationData'
import { getFullNLAddress } from '~/app/_utils/getFullNLAddress'
import { melding } from '~/mocks/data'

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
