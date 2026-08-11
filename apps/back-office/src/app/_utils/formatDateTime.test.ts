import { formatDateTime } from './formatDateTime'

describe('formatDateTime', () => {
  it('formats a date string correctly', () => {
    expect(formatDateTime('2024-03-05T08:09:00Z')).toBe('05-03-2024 08:09')
  })
})
