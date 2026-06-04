import { safeJSONParse } from './safeJSONParse'

describe('safeJSONParse', () => {
  it('returns undefined for invalid JSON', () => {
    expect(safeJSONParse('invalid', undefined)).toBeUndefined()
  })

  it('parses valid JSON', () => {
    expect(safeJSONParse('{"key":"value"}', undefined)).toEqual({ key: 'value' })
  })
})
