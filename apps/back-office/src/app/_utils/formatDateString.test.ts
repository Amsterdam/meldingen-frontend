import { formatDateString } from './formatDateString'

describe('formateDateString', () => {
  describe('Date format tests', () => {
    it.each([
      { expected: '17-8-2026', input: '2026-08-17' },
      { expected: '31-1-2025', input: '2025/01/31' },
      { expected: '5-3-2024', input: '2024-03-05T14:23:45Z' },
    ])('should return $expected for input $input', ({ expected, input }) => {
      const result = formatDateString(input)

      expect(result.date).toBe(expected)
    })
  })
  describe('Date format tests', () => {
    it.each([
      { expected: '17-08-2026', input: '2026-08-17' },
      { expected: '31-01-2025', input: '2025/01/31' },
      { expected: '05-03-2024', input: '2024-03-05T14:23:45Z' },
    ])('should apply date options and return $expected for input $input', ({ expected, input }) => {
      const result = formatDateString(input, {
        date: {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      })

      expect(result.date).toBe(expected)
    })
  })

  describe('Time format tests', () => {
    it.each([
      { expected: '14:23:45', input: '2024-03-05T14:23:45Z' },
      { expected: '09:55:03', input: '2026-08-17T09:55:03Z' },
    ])('should return $expected for input $input', ({ expected, input }) => {
      const result = formatDateString(input)

      expect(result.time).toBe(expected)
    })

    it.each([
      { expected: '14:23', input: '2024-03-05T14:23:45Z' },
      { expected: '09:55', input: '2026-08-17T09:55:03Z' },
    ])('should apply time options and return $expected for input $input', ({ expected, input }) => {
      const result = formatDateString(input, {
        time: {
          hour: 'numeric',
          minute: 'numeric',
        },
      })

      expect(result.time).toBe(expected)
    })
  })
})
