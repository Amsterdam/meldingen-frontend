import { isReclassificationAllowed } from './isReclassificationAllowed'

describe('isReclassificationAllowed', () => {
  it('returns false for completed meldingen', () => {
    expect(isReclassificationAllowed('completed')).toBe(false)
  })

  it('returns false for canceled meldingen', () => {
    expect(isReclassificationAllowed('canceled')).toBe(false)
  })

  it('returns true for states that still allow reclassification', () => {
    expect(isReclassificationAllowed('processing')).toBe(true)
  })
})
