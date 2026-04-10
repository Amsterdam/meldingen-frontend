import { render, waitFor } from '@testing-library/react'
import { Layer, Map } from 'leaflet'
import { Mock, vi } from 'vitest'

import { getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

import { MapComponent } from '../Map/Map'
import { fetchFeaturesOnMoveEnd, MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  assetTypeId: 1,
  classification: 'container',
  features: [],
  filter:
    '<Filter><And><PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>1</Literal></PropertyIsEqualTo><BBOX><gml:Envelope srsName="{srsName}"><gml:lowerCorner>{west} {south}</gml:lowerCorner><gml:upperCorner>{east} {north}</gml:upperCorner></gml:Envelope></BBOX></And></Filter>',
  maxMarkers: 5,
  onFeaturesChange: vi.fn(),
  onMaxMarkersReached: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  selectedMarkers: [],
  srsName: 'EPSG:4326',
  typeNames: 'Type name',
  updateSelectedPoint: vi.fn(),
}

const mockMapInstance = {
  getBounds: vi.fn(() => ({
    getEast: vi.fn(() => 4.911),
    getNorth: vi.fn(() => 52.3792),
    getSouth: vi.fn(() => 52.3676),
    getWest: vi.fn(() => 4.9041),
  })),
  getSize: vi.fn(() => ({ x: 800, y: 600 })),
  getZoom: vi.fn(() => 18),
  invalidateSize: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  remove: vi.fn(),
} as unknown as Map

vi.mock('@meldingen/api-client', () => ({
  getAssetTypeByAssetTypeIdWfs: vi.fn().mockResolvedValue({ data: { features: ['Test feature'] }, error: undefined }),
}))

describe('MarkerSelectLayer', () => {
  it('returns undefined', () => {
    const { container } = render(<MarkerSelectLayer {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })

  it('removes the moveend handler on unmount', () => {
    const { unmount } = render(
      <MapComponent testMapInstance={mockMapInstance}>
        <MarkerSelectLayer {...defaultProps} classification={undefined} />
      </MapComponent>,
    )
    const moveEndOnCall = (mockMapInstance.on as unknown as Mock).mock.calls.find((call) => call[0] === 'moveend')
    expect(moveEndOnCall).toBeDefined()

    const moveEndHandler = moveEndOnCall?.[1]

    expect(moveEndHandler).toEqual(expect.any(Function))

    unmount()

    expect(mockMapInstance.off).toHaveBeenCalledWith('moveend', moveEndHandler)
  })

  // Test one section of the fetchFeaturesOnMoveEnd function
  // using the moveend event, to test that entire path.
  // All other sections are covered in the fetchFeaturesOnMoveEnd tests.
  it('calls onFeaturesChange with fetched assets', async () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <MarkerSelectLayer {...defaultProps} />
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
    const result = await fetchFeaturesOnMoveEnd(
      mockMapInstance,
      vi.fn(),
      { current: null },
      1,
      'Type name',
      'EPSG:4326',
      undefined,
      defaultProps.filter,
    )

    expect(result).toBeUndefined()
  })

  it('does not fetch assets if map is hidden', async () => {
    const mockMapInstanceHidden = {
      ...mockMapInstance,
      getSize: vi.fn(() => ({ x: 0, y: 0 })),
    } as unknown as Map

    const result = await fetchFeaturesOnMoveEnd(
      mockMapInstanceHidden,
      vi.fn(),
      { current: null },
      1,
      'Type name',
      'EPSG:4326',
      'container',
      defaultProps.filter,
    )

    expect(result).toBeUndefined()
  })

  it('logs an error when the API call fails', () => {
    vi.mocked(getAssetTypeByAssetTypeIdWfs).mockResolvedValueOnce({
      data: undefined,
      error: { detail: 'Test error' },
      response: {} as Response,
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    fetchFeaturesOnMoveEnd(
      mockMapInstance,
      vi.fn(),
      { current: null },
      1,
      'Type name',
      'EPSG:4326',
      'container',
      defaultProps.filter,
    )

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

    await fetchFeaturesOnMoveEnd(
      lowZoomMapInstance,
      mockOnFeaturesChange,
      mockMarkerLayerRef,
      1,
      'Type name',
      'EPSG:4326',
      'container',
      defaultProps.filter,
    )

    expect(mockOnFeaturesChange).toHaveBeenCalledWith([])
    expect(mockMarkerLayerRef.current.remove).toHaveBeenCalled()
  })
})
