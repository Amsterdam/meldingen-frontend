import { CRS, latLng, Point, Transformation } from 'leaflet'
import { describe, expect, it } from 'vitest'

import getCrsRd, { CRS_CONFIG, proj4RD } from './getCrsRd'

describe('CRS_CONFIG', () => {
  it('has the correct earth radius', () => {
    expect(CRS_CONFIG.EARTH_RADIUS).toBe(6378137)
  })

  it('has the correct RD EPSG code', () => {
    expect(CRS_CONFIG.RD.code).toBe('EPSG:28992')
  })

  it('has an RD proj4 definition using the stereographic projection', () => {
    expect(CRS_CONFIG.RD.projection).toContain('+proj=sterea')
    expect(CRS_CONFIG.RD.projection).toContain('+lat_0=52.15616055555555')
    expect(CRS_CONFIG.RD.projection).toContain('+lon_0=5.38763888888889')
    expect(CRS_CONFIG.RD.projection).toContain('+units=m')
  })

  it('has the correct RD transformation bounds', () => {
    expect(CRS_CONFIG.RD.transformation.bounds.topLeft).toEqual([-285401, 903401])
    expect(CRS_CONFIG.RD.transformation.bounds.bottomRight).toEqual([595401.92, 22598.08])
  })

  it('has the correct WGS84 code and proj4 definition', () => {
    expect(CRS_CONFIG.WGS84.code).toBe('EPSG:4326')
    expect(CRS_CONFIG.WGS84.projection).toBe('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
  })
})

describe('getCrsRd', () => {
  describe('basic CRS shape', () => {
    it('uses the configured RD code', () => {
      const crs = getCrsRd()
      expect(crs.code).toBe(CRS_CONFIG.RD.code)
    })

    it('is not infinite', () => {
      const crs = getCrsRd()
      expect(crs.infinite).toBe(false)
    })

    it('uses CRS.Earth.distance as its distance function', () => {
      const crs = getCrsRd()
      expect(crs.distance).toBe(CRS.Earth.distance)
    })

    it('uses the configured earth radius', () => {
      const crs = getCrsRd()
      expect(crs.R).toBe(CRS_CONFIG.EARTH_RADIUS)
    })

    it('inherits properties from CRS.Simple that are not overridden', () => {
      const crs = getCrsRd()
      expect(crs.wrapLng).toBe(CRS.Simple.wrapLng)
      expect(crs.wrapLat).toBe(CRS.Simple.wrapLat)
    })
  })

  describe('transformation', () => {
    it('creates a Transformation instance with the expected coefficients', () => {
      const crs = getCrsRd()
      expect(crs.transformation).toBeInstanceOf(Transformation)

      // Transformation(1, 285401.92, -1, 903401.92) applied to (0,0) at scale 1
      // => x' = 1*0 + 285401.92, y' = -1*0 + 903401.92
      const transformed = crs.transformation.transform(new Point(0, 0), 1)
      expect(transformed.x).toBeCloseTo(285401.92)
      expect(transformed.y).toBeCloseTo(903401.92)
    })

    it('applies the transformation coefficients correctly for a non-zero point', () => {
      const crs = getCrsRd()
      const transformed = crs.transformation.transform(new Point(1000, 2000), 1)
      expect(transformed.x).toBeCloseTo(1 * 1000 + 285401.92)
      expect(transformed.y).toBeCloseTo(-1 * 2000 + 903401.92)
    })
  })

  describe('projection bounds', () => {
    it('normalizes the configured RD bounds into min/max', () => {
      const crs = getCrsRd()
      const projBounds = crs.projection.bounds

      expect(projBounds.min?.x).toBeCloseTo(-285401)
      expect(projBounds.min?.y).toBeCloseTo(22598.08)
      expect(projBounds.max?.x).toBeCloseTo(595401.92)
      expect(projBounds.max?.y).toBeCloseTo(903401)
    })

    it('exposes the raw proj4 definition on the projection', () => {
      const crs = getCrsRd()
      expect(crs.projection.proj4def).toBe(CRS_CONFIG.RD.projection)
    })
  })

  describe('project / unproject', () => {
    it('projects a LatLng using proj4RD.forward and returns a Point', () => {
      const crs = getCrsRd()
      const ll = latLng(52.0907, 5.1214)
      const point = crs.projection.project(ll)

      const [expectedX, expectedY] = proj4RD.forward([5.1214, 52.0907])

      expect(point).toBeInstanceOf(Point)
      expect(point.x).toBeCloseTo(expectedX)
      expect(point.y).toBeCloseTo(expectedY)
    })

    it('unprojects a Point using proj4RD.inverse and returns a LatLng', () => {
      const crs = getCrsRd()
      const point = new Point(136000, 456000)
      const ll = crs.projection.unproject(point)

      const [expectedLng, expectedLat] = proj4RD.inverse([136000, 456000])

      expect(ll.lat).toBeCloseTo(expectedLat)
      expect(ll.lng).toBeCloseTo(expectedLng)
    })

    it('round-trips project -> unproject back to the original LatLng', () => {
      const crs = getCrsRd()
      const original = latLng(52.3731, 4.8926)

      const projected = crs.projection.project(original)
      const back = crs.projection.unproject(projected)

      expect(back.lat).toBeCloseTo(original.lat, 6)
      expect(back.lng).toBeCloseTo(original.lng, 6)
    })
  })

  describe('scale', () => {
    it('returns the precomputed scale for every zoom level within maxZoom', () => {
      const crs = getCrsRd(16, 3440.64)

      for (let z = 0; z <= 16; z++) {
        const expected = 1 / (3440.64 * 0.5 ** z)
        expect(crs.scale(z)).toBeCloseTo(expected)
      }
    })

    it('falls back to the formula for zoom levels beyond the precomputed range', () => {
      const crs = getCrsRd(5, 3440.64)
      const expected = 1 / (3440.64 * 0.5 ** 10)
      expect(crs.scale(10)).toBeCloseTo(expected)
    })

    it('respects a custom zeroScale', () => {
      const crs = getCrsRd(4, 1000)
      expect(crs.scale(0)).toBeCloseTo(1 / 1000)
      expect(crs.scale(1)).toBeCloseTo(1 / 500)
      expect(crs.scale(2)).toBeCloseTo(1 / 250)
    })

    it('scale increases as zoom increases (zooming in makes things bigger)', () => {
      const crs = getCrsRd()
      expect(crs.scale(5)).toBeGreaterThan(crs.scale(4))
      expect(crs.scale(1)).toBeGreaterThan(crs.scale(0))
    })
  })

  describe('zoom', () => {
    it('inverts the scale function for precomputed zoom levels', () => {
      const crs = getCrsRd()
      for (let z = 0; z <= 5; z++) {
        const s = crs.scale(z)
        expect(crs.zoom(s)).toBeCloseTo(z, 5)
      }
    })

    it('computes zoom correctly using the default zeroScale', () => {
      const crs = getCrsRd()
      const scale = 1 / (3440.64 * 0.5 ** 3)
      expect(crs.zoom(scale)).toBeCloseTo(3)
    })

    it('computes zoom correctly using a custom zeroScale', () => {
      const crs = getCrsRd(10, 1000)
      const scale = 1 / (1000 * 0.5 ** 4)
      expect(crs.zoom(scale)).toBeCloseTo(4)
    })
  })

  describe('scales array parameter (mutable default argument behavior)', () => {
    it('populates a user-supplied empty array with maxZoom + 1 entries', () => {
      const customScales: number[] = []
      getCrsRd(2, 3440.64, customScales)

      expect(customScales).toHaveLength(3) // zoom 0, 1, 2
      expect(customScales[0]).toBeCloseTo(1 / 3440.64)
      expect(customScales[2]).toBeCloseTo(1 / (3440.64 * 0.5 ** 2))
    })

    it('appends to (rather than replacing) a pre-populated scales array', () => {
      // NOTE: this documents a side-effect of the implementation: since
      // `scales.push(...)` is used without clearing the array first, any
      // pre-existing entries are preserved and new entries are appended
      // after them, rather than the array being reset/overwritten.
      const preExisting = [999]
      getCrsRd(1, 3440.64, preExisting)

      expect(preExisting[0]).toBe(999)
      expect(preExisting).toHaveLength(1 + 2) // original entry + zoom 0,1
      expect(preExisting[1]).toBeCloseTo(1 / 3440.64)
      expect(preExisting[2]).toBeCloseTo(1 / (3440.64 * 0.5 ** 1))
    })

    it('does not leak scales between separate calls when no array is passed', () => {
      const crsA = getCrsRd(2)
      const crsB = getCrsRd(2)

      expect(crsA.scale(0)).toBeCloseTo(crsB.scale(0))
      expect(crsA.scale(2)).toBeCloseTo(crsB.scale(2))
    })
  })

  describe('default parameters', () => {
    it('uses maxZoom=16 and zeroScale=3440.64 when called with no arguments', () => {
      const crs = getCrsRd()
      expect(crs.scale(0)).toBeCloseTo(1 / 3440.64)
      expect(crs.scale(16)).toBeCloseTo(1 / (3440.64 * 0.5 ** 16))
      // zoom 17 is beyond the default precomputed range, so it should
      // fall back to the formula rather than throwing or returning undefined
      expect(crs.scale(17)).toBeCloseTo(1 / (3440.64 * 0.5 ** 17))
    })
  })
})
