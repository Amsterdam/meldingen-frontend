import { safeJSONParse } from './safeJSONParse'

describe('safeJSONParse', () => {
  it('returns fallback for invalid JSON', () => {
    expect(safeJSONParse('invalid', 'fallback')).toBe('fallback')
  })

  it('returns fallback for non-string values', () => {
    expect(safeJSONParse(123, 'fallback')).toBe('fallback')
  })

  it('parses valid JSON', () => {
    expect(safeJSONParse('{"key":"value"}', undefined)).toEqual({ key: 'value' })
  })
})
