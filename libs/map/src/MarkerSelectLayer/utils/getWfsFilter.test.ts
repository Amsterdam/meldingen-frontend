import L from 'leaflet'
import { describe, expect, it, vi } from 'vitest'

import { getWfsFilter } from './getWfsFilter'

describe('getWfsFilter', () => {
  const mockBounds = {
    getEast: vi.fn(),
    getNorth: vi.fn(),
    getSouth: vi.fn(),
    getWest: vi.fn(),
  }

  const mockMapInstance = {
    getBounds: vi.fn(),
  } as unknown as L.Map

  beforeEach(() => {
    mockBounds.getEast.mockReset()
    mockBounds.getNorth.mockReset()
    mockBounds.getSouth.mockReset()
    mockBounds.getWest.mockReset()
    mockMapInstance.getBounds = vi.fn(() => mockBounds as unknown as L.LatLngBounds)
  })

  it('should return a filter with correct coordinates', () => {
    mockBounds.getWest.mockReturnValue(20)
    mockBounds.getSouth.mockReturnValue(10)
    mockBounds.getEast.mockReturnValue(40)
    mockBounds.getNorth.mockReturnValue(30)

    const template =
      '<Filter><And><PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>1</Literal></PropertyIsEqualTo><BBOX><gml:Envelope srsName="{srsName}"><gml:lowerCorner>{west} {south}</gml:lowerCorner><gml:upperCorner>{east} {north}</gml:upperCorner></gml:Envelope></BBOX></And></Filter>'

    const filter = getWfsFilter({ filter: template, srsName: 'EPSG:4326' }, mockMapInstance)
    expect(filter).toContain('srsName="EPSG:4326"')
    expect(filter).toContain('<gml:lowerCorner>20 10</gml:lowerCorner>')
    expect(filter).toContain('<gml:upperCorner>40 30</gml:upperCorner>')
    expect(filter).toContain('<PropertyName>status</PropertyName>')
    expect(filter).toContain('<Literal>1</Literal>')
  })
})
