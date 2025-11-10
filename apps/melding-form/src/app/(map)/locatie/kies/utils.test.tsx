import { convertWktPointToCoordinates } from './utils'

describe('convertWktPointToCoordinates', () => {
  it('should convert a WKT point to lat lng location with comma or space as separation', () => {
    expect(convertWktPointToCoordinates('POINT(4.90225668 52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })

    expect(convertWktPointToCoordinates('POINT(4.90225668,52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })
  })

  it('should work when the lng is alphabetically bigger than the lat', () => {
    expect(convertWktPointToCoordinates('POINT(6.90225668 52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 6.90225668,
    })

    expect(convertWktPointToCoordinates('POINT(6.90225668,52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 6.90225668,
    })
  })

  it('should use the smallest number of the two as longitude, expecting to be in the area of north west Europe', () => {
    expect(convertWktPointToCoordinates('POINT(52.36150435 6.90225668)')).toEqual({
      lat: 52.36150435,
      lng: 6.90225668,
    })

    expect(convertWktPointToCoordinates('POINT(52.36150435,4.90225668)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })
  })

  it('should return undefined on wrong input', () => {
    expect(convertWktPointToCoordinates('POLYGON(4.90225668 52.36150435)')).toBeUndefined()
    expect(convertWktPointToCoordinates('POINT(4.90225668)')).toBeUndefined()
  })
})
