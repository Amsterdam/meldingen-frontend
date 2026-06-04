import { getShortNLAddress } from './getShortNLAddress'

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
