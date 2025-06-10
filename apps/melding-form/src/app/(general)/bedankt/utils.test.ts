import { getDescription } from './utils'

const t = vi.fn().mockImplementation((key, params) => `${key}:${JSON.stringify(params)}`)

describe('getDescription', () => {
  const mockDate = '2025-10-05T15:00:00Z'
  const mockDateObj = new Date(mockDate)
  const formattedDate = mockDateObj.toLocaleDateString('nl-NL')
  const formattedTime = mockDateObj.toLocaleTimeString('nl-NL', { timeStyle: 'short' })

  it('returns default description when publicId and createdAt are provided', () => {
    const result = getDescription(t, 'abc123', mockDate)
    expect(result).toBe(
      `description.default:${JSON.stringify({
        publicId: 'abc123',
        date: formattedDate,
        time: formattedTime,
      })}`,
    )
  })

  it('returns no-public-id description when only createdAt is provided', () => {
    const result = getDescription(t, undefined, mockDate)
    expect(result).toBe(
      `description.no-public-id:${JSON.stringify({
        date: formattedDate,
        time: formattedTime,
      })}`,
    )
  })

  it('returns no-date description when only publicId is provided', () => {
    const result = getDescription(t, 'xyz789', undefined)
    expect(result).toBe(`description.no-date:${JSON.stringify({ publicId: 'xyz789' })}`)
  })

  it('returns fallback description when neither publicId nor createdAt are provided', () => {
    const t = vi.fn().mockImplementation((key) => `${key}`)
    const result = getDescription(t, undefined, undefined)
    expect(result).toBe('description.fallback')
  })
})
