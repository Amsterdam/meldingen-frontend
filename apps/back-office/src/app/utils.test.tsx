import { getFullNLAddress, getShortNLAddress } from './utils'

describe('getShortNLAddress', () => {
  it('returns the correct short address when all fields are present', () => {
    const address = getShortNLAddress({
      house_number: 1,
      house_number_addition: 'A',
      street: 'Damrak',
    })

    expect(address).toBe('Damrak 1A')
  })

  it('returns the correct short address when house_number_addition is missing', () => {
    const address = getShortNLAddress({
      house_number: 1,
      house_number_addition: undefined,
      street: 'Damrak',
    })

    expect(address).toBe('Damrak 1')
  })

  it('returns undefined if street is missing', () => {
    const address = getShortNLAddress({
      house_number: 1,
      house_number_addition: 'A',
      street: undefined,
    })

    expect(address).toBeUndefined()
  })

  it('returns undefined if house_number is missing', () => {
    const address = getShortNLAddress({
      house_number: undefined,
      house_number_addition: 'A',
      street: 'Damrak',
    })

    expect(address).toBeUndefined()
  })
})

describe('getFullNLAddress', () => {
  it('returns the correct full address when all fields are present', () => {
    const address = getFullNLAddress({
      city: 'Amsterdam',
      house_number: 1,
      house_number_addition: 'A',
      postal_code: '1012LG',
      street: 'Damrak',
    })

    expect(address).toBe('Damrak 1A, 1012LG Amsterdam')
  })

  it('returns undefined if short address is missing', () => {
    const address = getFullNLAddress({
      city: 'Amsterdam',
      house_number: 1,
      house_number_addition: 'A',
      postal_code: '1012LG',
      street: undefined,
    })

    expect(address).toBeUndefined()
  })

  it('returns undefined if postal_code is missing', () => {
    const address = getFullNLAddress({
      city: 'Amsterdam',
      house_number: 1,
      house_number_addition: 'A',
      postal_code: undefined,
      street: 'Damrak',
    })

    expect(address).toBeUndefined()
  })

  it('returns undefined if city is missing', () => {
    const address = getFullNLAddress({
      city: undefined,
      house_number: 1,
      house_number_addition: 'A',
      postal_code: '1012LG',
      street: 'Damrak',
    })
    expect(address).toBeUndefined()
  })
})
