import { getContactData } from './getContactData'
import { melding } from '~/mocks/data'

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
