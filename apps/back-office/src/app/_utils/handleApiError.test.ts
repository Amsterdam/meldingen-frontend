import { handleApiError } from './handleApiError'

describe('handleApiError', () => {
  it('returns the detail string for a simple API error', () => {
    expect(handleApiError({ detail: 'Not found' })).toBe('Not found')
  })

  it('returns joined messages for an API error array with multiple items', () => {
    const error = { detail: [{ msg: 'Field required' }, { msg: 'Invalid value' }] }
    expect(handleApiError(error)).toBe('Field required, Invalid value')
  })

  it('returns the single message for an API error array with one item', () => {
    const error = { detail: [{ msg: 'Field required' }] }
    expect(handleApiError(error)).toBe('Field required')
  })

  it('returns the fallback message for an unknown object', () => {
    expect(handleApiError({ message: 'something' })).toBe('An unknown error occurred')
  })

  it('returns the fallback message for null', () => {
    expect(handleApiError(null)).toBe('An unknown error occurred')
  })

  it('returns the fallback message for a non-object', () => {
    expect(handleApiError('unexpected string')).toBe('An unknown error occurred')
  })

  it('returns the fallback message for undefined', () => {
    expect(handleApiError(undefined)).toBe('An unknown error occurred')
  })
})
