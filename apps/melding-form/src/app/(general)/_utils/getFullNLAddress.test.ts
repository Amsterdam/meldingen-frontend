import { getFullNLAddress, getShortNLAddress } from './getFullNLAddress'

describe('getShortNLAddress', () => {
  it('returns the correct short address when all fields are present', () => {
    const address = getShortNLAddress({
      street: 'Damrak',
      house_number: 1,
      house_number_addition: 'A',
    })

    expect(address).toBe('Damrak 1A')
  })

  it('returns the correct short address when house_number_addition is missing', () => {
    const address = getShortNLAddress({
      street: 'Damrak',
      house_number: 1,
      house_number_addition: undefined,
    })

    expect(address).toBe('Damrak 1')
  })

  it('returns undefined if street is missing', () => {
    const address = getShortNLAddress({
      street: undefined,
      house_number: 1,
      house_number_addition: 'A',
    })

    expect(address).toBeUndefined()
  })

  it('returns undefined if house_number is missing', () => {
    const address = getShortNLAddress({
      street: 'Damrak',
      house_number: undefined,
      house_number_addition: 'A',
    })

    expect(address).toBeUndefined()
  })
})

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
})
