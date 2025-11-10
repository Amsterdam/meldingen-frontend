import L from 'leaflet'
import { describe, expect, it, vi } from 'vitest'

import { getWfsFilter } from './getWfsFilter'

describe('getWfsFilter', () => {
  const mockBounds = {
    getSouthWest: vi.fn(),
    getNorthEast: vi.fn(),
  }

  const mockMapInstance = {
    getBounds: vi.fn(),
  } as unknown as L.Map

  beforeEach(() => {
    mockBounds.getSouthWest.mockReset()
    mockBounds.getNorthEast.mockReset()
    mockMapInstance.getBounds = vi.fn(() => mockBounds as unknown as L.LatLngBounds)
  })

  it('should return a filter with correct coordinates', () => {
    mockBounds.getSouthWest.mockReturnValue({ lat: 10, lng: 20 })
    mockBounds.getNorthEast.mockReturnValue({ lat: 30, lng: 40 })

    const filter = getWfsFilter(mockMapInstance)
    expect(filter).toContain('<gml:lowerCorner>20 10</gml:lowerCorner>')
    expect(filter).toContain('<gml:upperCorner>40 30</gml:upperCorner>')
    expect(filter).toContain('<PropertyName>status</PropertyName>')
    expect(filter).toContain('<Literal>1</Literal>')
  })
})
