import type { Bounds, CRS, Projection } from 'leaflet'

import L from 'leaflet'

import getCrsRd, { CRS_CONFIG } from './getCrsRd'

type RdProjection = Projection & {
  bounds: Bounds
  proj4def: string
}

describe('getCrsRd', () => {
  it('returns the expected RD CRS configuration', () => {
    const crs = getCrsRd()
    const projection = crs.projection as RdProjection

    expect(crs.code).toBe(CRS_CONFIG.RD.code)
    expect(crs.distance).toBe(L.CRS.Earth.distance)
    expect(crs.infinite).toBe(false)
    expect(crs.R).toBe(CRS_CONFIG.EARTH_RADIUS)
    expect(projection.proj4def).toBe(CRS_CONFIG.RD.projection)
    expect(projection.bounds.min.x).toBe(CRS_CONFIG.RD.transformation.bounds.topLeft[0])
    expect(projection.bounds.min.y).toBe(CRS_CONFIG.RD.transformation.bounds.bottomRight[1])
    expect(projection.bounds.max.x).toBe(CRS_CONFIG.RD.transformation.bounds.bottomRight[0])
    expect(projection.bounds.max.y).toBe(CRS_CONFIG.RD.transformation.bounds.topLeft[1])
  })

  it('calculates scales for cached and uncached zoom levels', () => {
    const zeroScale = 1000
    const crs = getCrsRd(2, zeroScale)

    expect(crs.scale(0)).toBe(1 / zeroScale)
    expect(crs.scale(1)).toBe(1 / (zeroScale * 0.5))
    expect(crs.scale(2)).toBe(1 / (zeroScale * 0.25))
    expect(crs.scale(3)).toBe(1 / (zeroScale * 0.125))
  })

  it('uses matching scale and zoom conversions', () => {
    const crs = getCrsRd()
    const zoomLevel = 5
    const scale = crs.scale(zoomLevel)

    expect(crs.zoom(scale)).toBe(zoomLevel)
  })

  it('projects and unprojects coordinates consistently', () => {
    const crs = getCrsRd()
    const projection = crs.projection as CRS['projection']
    const amsterdam = L.latLng(52.370216, 4.895168)

    const point = projection.project(amsterdam)
    const roundTrip = projection.unproject(point)

    expect(point.x).toBeCloseTo(121490, 0)
    expect(point.y).toBeCloseTo(487040, 0)
    expect(roundTrip.lat).toBeCloseTo(amsterdam.lat, 6)
    expect(roundTrip.lng).toBeCloseTo(amsterdam.lng, 6)
  })
})
