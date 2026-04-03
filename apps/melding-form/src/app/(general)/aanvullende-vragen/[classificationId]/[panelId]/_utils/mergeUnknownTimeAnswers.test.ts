import { mergeUnknownTimeAnswers } from './mergeUnknownTimeAnswers'

describe('mergeUnknownTimeAnswers', () => {
  it('returns entries unchanged when there are no unknown checkboxes', () => {
    const entries: [string, string | string[]][] = [
      ['q1', '10:00'],
      ['q2', 'some value'],
    ]

    expect(mergeUnknownTimeAnswers(entries)).toEqual(entries)
  })

  it('sets the time value to "unknown" when the unknown checkbox is checked', () => {
    const entries: [string, string | string[]][] = [
      ['someTime', '10:00'],
      ['someTime-time-unknown', 'on'],
    ]

    expect(mergeUnknownTimeAnswers(entries)).toEqual([['someTime', 'unknown']])
  })

  it('does not set the time value to "unknown" when the unknown checkbox is not checked', () => {
    const entries: [string, string | string[]][] = [
      ['someTime', '10:00'],
      ['someTime-time-unknown', 'off'],
    ]

    expect(mergeUnknownTimeAnswers(entries)).toEqual([['someTime', '10:00']])
  })

  it('adds a missing time key as "unknown" when the checkbox is checked but the time input is absent', () => {
    // Some browsers omit empty <input type="time"> from FormData
    const entries: [string, string | string[]][] = [['someTime-time-unknown', 'on']]

    expect(mergeUnknownTimeAnswers(entries)).toEqual([['someTime', 'unknown']])
  })

  it('handles multiple time fields independently', () => {
    const entries: [string, string | string[]][] = [
      ['time1', '08:00'],
      ['time1-time-unknown', 'on'],
      ['time2', '09:00'],
      ['time2-time-unknown', 'off'],
      ['time3-time-unknown', 'on'], // time3 input absent
    ]

    expect(mergeUnknownTimeAnswers(entries)).toEqual([
      ['time1', 'unknown'],
      ['time2', '09:00'],
      ['time3', 'unknown'],
    ])
  })

  it('handles an empty entries array', () => {
    expect(mergeUnknownTimeAnswers([])).toEqual([])
  })
})
