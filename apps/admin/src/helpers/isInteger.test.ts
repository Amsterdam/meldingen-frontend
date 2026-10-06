import { isInteger } from './isInteger'

describe('integerValue', () => {
  it('returns undefined for integer values', () => {
    const validate = isInteger()

    expect(validate('42')).toBeUndefined()
    expect(validate('0')).toBeUndefined()
    expect(validate('-10')).toBeUndefined()
  })

  it('returns the default message for non-integer values', () => {
    const validate = isInteger()

    expect(validate('3.14')).toBe('ra.validation.integer')
    expect(validate('abc')).toBe('ra.validation.integer')
    expect(validate(null)).toBe('ra.validation.integer')
    expect(validate(undefined as unknown as string)).toBe('ra.validation.integer')
  })

  it('returns the custom message when provided', () => {
    const validate = isInteger('custom.integer.message')

    expect(validate('1.5')).toBe('custom.integer.message')
  })
})
