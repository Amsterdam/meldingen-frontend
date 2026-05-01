import { hasValidationErrors } from './hasValidationErrors'

describe('hasValidationErrors', () => {
  it('returns true for status 422 and value_error in error array', () => {
    const response = { status: 422 } as Response
    const error = { detail: [{ type: 'value_error' }] }

    expect(hasValidationErrors(response, error)).toBe(true)
  })

  it('returns false if status is not 422', () => {
    const response = { status: 400 } as Response
    const error = { detail: [{ type: 'value_error' }] }

    expect(hasValidationErrors(response, error)).toBe(false)
  })

  it('returns false if error is not an array', () => {
    const response = { status: 422 } as Response
    const error = { detail: { type: 'value_error' } }

    expect(hasValidationErrors(response, error)).toBe(false)
  })

  it('returns false if no value_error in error array', () => {
    const response = { status: 422 } as Response
    const error = { detail: [{ type: 'other_error' }] }

    expect(hasValidationErrors(response, error)).toBe(false)
  })

  it('returns false if error.detail is undefined', () => {
    const response = { status: 422 } as Response
    const error = {}

    expect(hasValidationErrors(response, error)).toBe(false)
  })
})
