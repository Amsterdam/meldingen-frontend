import { getFullNLAddress } from './getFullNLAddress'

describe('getFullNLAddress', () => {
  it('returns the correct full address when all fields are present', () => {
    const address = getFullNLAddress({
      street: 'Damrak',
      house_number: 1,
      house_number_addition: 'A',
      postal_code: '1012LG',
      city: 'Amsterdam',
    })

    expect(address).toBe('Damrak 1A, 1012LG Amsterdam')
  })

  it('returns undefined if short address is missing', () => {
    const address = getFullNLAddress({
      street: undefined,
      house_number: 1,
      house_number_addition: 'A',
      postal_code: '1012LG',
      city: 'Amsterdam',
    })

    expect(address).toBeUndefined()
  })

  it('returns undefined if postal_code is missing', () => {
    const address = getFullNLAddress({
      street: 'Damrak',
      house_number: 1,
      house_number_addition: 'A',
      postal_code: undefined,
      city: 'Amsterdam',
    })

    expect(address).toBeUndefined()
  })

  it('returns undefined if city is missing', () => {
    const address = getFullNLAddress({
      street: 'Damrak',
      house_number: 1,
      house_number_addition: 'A',
      postal_code: '1012LG',
      city: undefined,
    })
    expect(address).toBeUndefined()
  })

  it('returns address without house_number_addition when does not exist', () => {
    const address = getFullNLAddress({
      street: 'Damrak',
      house_number: 1,
      house_number_addition: undefined,
      postal_code: '1012LG',
      city: 'Amsterdam',
    })
    expect(address).toBe('Damrak 1, 1012LG Amsterdam')
  })
})
