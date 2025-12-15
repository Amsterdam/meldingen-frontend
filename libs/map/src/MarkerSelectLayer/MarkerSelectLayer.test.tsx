import { render, waitFor } from '@testing-library/react'
import { Layer, Map } from 'leaflet'
import { Mock, vi } from 'vitest'

import { getWfsByName } from '@meldingen/api-client'

import { MapComponent } from '../Map/Map'
import { fetchFeaturesOnMoveEnd, MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  features: [],
  maxMarkers: 5,
  onFeaturesChange: vi.fn(),
  onMaxMarkersReached: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  selectedMarkers: [],
  updateSelectedPoint: vi.fn(),
}

const mockMapInstance = {
  getBounds: vi.fn(() => ({
    getNorthEast: vi.fn(() => ({ lat: 52.3792, lng: 4.911 })),
    getSouthWest: vi.fn(() => ({ lat: 52.3676, lng: 4.9041 })),
  })),
  getSize: vi.fn(() => ({ x: 800, y: 600 })),
  getZoom: vi.fn(() => 18),
  invalidateSize: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  remove: vi.fn(),
} as unknown as Map

vi.mock('@meldingen/api-client', () => ({
  getWfsByName: vi.fn().mockResolvedValue({ data: { features: ['Test feature'] }, error: undefined }),
}))

describe('MarkerSelectLayer', () => {
  it('returns undefined', () => {
    const { container } = render(<MarkerSelectLayer {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })

  // Test one section of the fetchFeaturesOnMoveEnd function
  // using the moveend event, to test that entire path.
  // All other sections are covered in the fetchFeaturesOnMoveEnd tests.
  it('calls onFeaturesChange with fetched assets', async () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <MarkerSelectLayer {...defaultProps} classification="container" />
      </MapComponent>,
    )

    // Mock the map moveend event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'moveend') {
        call[1]()
      }
    })

    await waitFor(() => {
      expect(defaultProps.onFeaturesChange).toHaveBeenCalledWith(['Test feature'])
    })
  })
})

describe('fetchFeaturesOnMoveEnd', () => {
  it('returns undefined if classification is undefined', async () => {
    const result = await fetchFeaturesOnMoveEnd(undefined, mockMapInstance, vi.fn(), {
      current: null,
    })

    expect(result).toBeUndefined()
  })

  it('does not fetch assets if classification has no asset support', async () => {
    const result = await fetchFeaturesOnMoveEnd('invalid-classification', mockMapInstance, vi.fn(), {
      current: null,
    })

    expect(result).toBeUndefined()
  })

  it('does not fetch assets if map is hidden', async () => {
    const mockMapInstanceHidden = {
      ...mockMapInstance,
      getSize: vi.fn(() => ({ x: 0, y: 0 })),
    } as unknown as Map

    const result = await fetchFeaturesOnMoveEnd('container', mockMapInstanceHidden, vi.fn(), {
      current: null,
    })

    expect(result).toBeUndefined()
  })

  it('logs an error when the API call fails', () => {
    vi.mocked(getWfsByName).mockResolvedValueOnce({
      data: undefined,
      error: { detail: 'Test error' },
      response: {} as Response,
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    fetchFeaturesOnMoveEnd('container', mockMapInstance, vi.fn(), {
      current: null,
    })

    waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({ detail: 'Test error' })
    })

    consoleSpy.mockRestore()
  })

  it('calls onFeaturesChange with empty array and remove layer if zoom is below threshold', async () => {
    const mockOnFeaturesChange = vi.fn()

    const lowZoomMapInstance = {
      ...mockMapInstance,
      getZoom: vi.fn(() => 2),
    } as unknown as Map

    const mockMarkerLayerRef = { current: { remove: vi.fn() } as unknown as Layer }

    await fetchFeaturesOnMoveEnd('container', lowZoomMapInstance, mockOnFeaturesChange, mockMarkerLayerRef)

    expect(mockOnFeaturesChange).toHaveBeenCalledWith([])
    expect(mockMarkerLayerRef.current.remove).toHaveBeenCalled()
  })
})
