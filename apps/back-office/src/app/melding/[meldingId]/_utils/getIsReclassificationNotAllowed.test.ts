import { getIsReclassificationNotAllowed } from './getIsReclassificationNotAllowed'

describe('getIsReclassificationNotAllowed', () => {
  it('returns true for completed meldingen', () => {
    expect(getIsReclassificationNotAllowed('completed')).toBe(true)
  })

  it('returns true for canceled meldingen', () => {
    expect(getIsReclassificationNotAllowed('canceled')).toBe(true)
  })

  it('returns false for states that still allow reclassification', () => {
    expect(getIsReclassificationNotAllowed('processing')).toBe(false)
  })
})
