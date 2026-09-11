import type { Layer, Map } from 'leaflet'
import type { RefObject } from 'react'
import type { Mock } from 'vitest'

import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

import type { Props } from './MarkerSelectLayer'

import { MapComponent } from '../Map/Map'
import { fetchFeaturesOnMoveEnd, MarkerSelectLayer } from './MarkerSelectLayer'

type WfsResult = Awaited<ReturnType<typeof getAssetTypeByAssetTypeIdWfs<false>>>

const defaultProps: Props = {
  features: [],
  iconConfig: {},
  maxMarkers: 5,
  onFeaturesChange: vi.fn(),
  onMaxMarkersReached: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  selectedMarkers: [],
  updateSelectedPoint: vi.fn(),
  wfsQuery: {
    assetTypeId: 1,
    classification: 'container',
    filter:
      '<Filter><And><PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>1</Literal></PropertyIsEqualTo><BBOX><gml:Envelope srsName="{srsName}"><gml:lowerCorner>{west} {south}</gml:lowerCorner><gml:upperCorner>{east} {north}</gml:upperCorner></gml:Envelope></BBOX></And></Filter>',
    srsName: 'EPSG:4326',
    typeNames: 'Type name',
  },
}

const mockMapInstance = {
  fire: vi.fn(),
  getBounds: vi.fn(() => ({
    getEast: vi.fn(() => 4.911),
    getNorth: vi.fn(() => 52.3792),
    getSouth: vi.fn(() => 52.3676),
    getWest: vi.fn(() => 4.9041),
  })),
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
        <MarkerSelectLayer {...defaultProps} wfsQuery={{ ...defaultProps.wfsQuery, classification: undefined }} />
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
      { ...defaultProps.wfsQuery, classification: undefined },
      { current: null },
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

    fetchFeaturesOnMoveEnd(mockMapInstance, vi.fn(), { current: null }, defaultProps.wfsQuery, { current: null })

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

    await fetchFeaturesOnMoveEnd(lowZoomMapInstance, mockOnFeaturesChange, mockMarkerLayerRef, defaultProps.wfsQuery, {
      current: null,
    })

    expect(mockOnFeaturesChange).toHaveBeenCalledWith([])
    expect(mockMarkerLayerRef.current.remove).toHaveBeenCalled()
  })

  it('aborts a still in-flight request when a new one starts, and ignores its response', async () => {
    let resolveFirstRequest: (value: WfsResult) => void = () => {}
    const firstRequestPromise = new Promise<WfsResult>((resolve) => {
      resolveFirstRequest = resolve
    })

    vi.mocked(getAssetTypeByAssetTypeIdWfs)
      .mockReturnValueOnce(firstRequestPromise)
      .mockResolvedValueOnce({ data: { features: ['Newer feature'] }, error: undefined } as unknown as WfsResult)

    const mockOnFeaturesChange = vi.fn()
    const pendingRequestRef: RefObject<AbortController | null> = { current: null }

    const firstCall = fetchFeaturesOnMoveEnd(
      mockMapInstance,
      mockOnFeaturesChange,
      { current: null },
      defaultProps.wfsQuery,
      pendingRequestRef,
    )

    const firstAbortController = pendingRequestRef.current

    await fetchFeaturesOnMoveEnd(
      mockMapInstance,
      mockOnFeaturesChange,
      { current: null },
      defaultProps.wfsQuery,
      pendingRequestRef,
    )

    expect(firstAbortController?.signal.aborted).toBe(true)
    expect(mockOnFeaturesChange).toHaveBeenCalledWith(['Newer feature'])

    resolveFirstRequest({ data: { features: ['Stale feature'] }, error: undefined } as unknown as WfsResult)
    await firstCall

    expect(mockOnFeaturesChange).not.toHaveBeenCalledWith(['Stale feature'])
    expect(mockOnFeaturesChange).toHaveBeenCalledTimes(1)
  })

  it('aborts a still in-flight request when the zoom drops below the threshold', async () => {
    let resolveFirstRequest: (value: WfsResult) => void = () => {}
    const firstRequestPromise = new Promise<WfsResult>((resolve) => {
      resolveFirstRequest = resolve
    })

    vi.mocked(getAssetTypeByAssetTypeIdWfs).mockReturnValueOnce(firstRequestPromise)

    const mockOnFeaturesChange = vi.fn()
    const pendingRequestRef: RefObject<AbortController | null> = { current: null }

    const firstCall = fetchFeaturesOnMoveEnd(
      mockMapInstance,
      mockOnFeaturesChange,
      { current: null },
      defaultProps.wfsQuery,
      pendingRequestRef,
    )

    const firstAbortController = pendingRequestRef.current

    const lowZoomMapInstance = {
      ...mockMapInstance,
      getZoom: vi.fn(() => 2),
    } as unknown as Map

    await fetchFeaturesOnMoveEnd(
      lowZoomMapInstance,
      mockOnFeaturesChange,
      { current: null },
      defaultProps.wfsQuery,
      pendingRequestRef,
    )

    expect(firstAbortController?.signal.aborted).toBe(true)

    resolveFirstRequest({ data: { features: ['Stale feature'] }, error: undefined } as unknown as WfsResult)
    await firstCall

    expect(mockOnFeaturesChange).not.toHaveBeenCalledWith(['Stale feature'])
  })
})
