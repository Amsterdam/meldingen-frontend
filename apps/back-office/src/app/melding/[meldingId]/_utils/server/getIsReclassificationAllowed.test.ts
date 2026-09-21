import { getIsReclassificationAllowed } from './getIsReclassificationAllowed'

describe('getIsReclassificationAllowed', () => {
  it('returns false for completed meldingen', () => {
    expect(getIsReclassificationAllowed('completed')).toBe(false)
  })

  it('returns false for canceled meldingen', () => {
    expect(getIsReclassificationAllowed('canceled')).toBe(false)
  })

  it('returns true for states that still allow reclassification', () => {
    expect(getIsReclassificationAllowed('processing')).toBe(true)
  })
})
