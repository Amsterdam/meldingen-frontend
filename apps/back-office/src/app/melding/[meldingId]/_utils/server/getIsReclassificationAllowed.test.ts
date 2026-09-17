import { getIsReclassificationAllowed } from './getIsReclassificationAllowed'

describe('getIsReclassificationAllowed', () => {
  it('returns true for completed meldingen', () => {
    expect(getIsReclassificationAllowed('completed')).toBe(true)
  })

  it('returns true for canceled meldingen', () => {
    expect(getIsReclassificationAllowed('canceled')).toBe(true)
  })

  it('returns false for states that still allow reclassification', () => {
    expect(getIsReclassificationAllowed('processing')).toBe(false)
  })
})
