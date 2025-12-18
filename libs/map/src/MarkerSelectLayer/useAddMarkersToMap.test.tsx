import type { RefObject } from 'react'

import { renderHook } from '@testing-library/react'
import L, { Layer, Map, MarkerClusterGroup } from 'leaflet'

import { Feature } from '@meldingen/api-client'

import type { Props } from './useAddMarkersToMap'

import { containerAssets } from './mocks/data'
import { createClusterIcon, useAddMarkersToMap } from './useAddMarkersToMap'

const mockMapInstance = {
  addLayer: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  removeLayer: vi.fn(),
} as unknown as Map

const mockMarkerLayerRef = { current: null } as unknown as RefObject<Layer | null>

const defaultProps: Props = {
  features: [],
  map: mockMapInstance,
  markerLayerRef: mockMarkerLayerRef,
  maxMarkers: 5,
  onMaxMarkersReached: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  selectedMarkers: [],
  updateSelectedPoint: vi.fn(),
}

describe('useAddMarkersToMap', () => {
  it('does nothing if map is not provided', () => {
    renderHook(() => useAddMarkersToMap({ ...defaultProps, map: undefined }))

    expect(mockMarkerLayerRef.current).toBeNull()
  })

  it('does nothing if features is empty', () => {
    renderHook(() => useAddMarkersToMap({ ...defaultProps, features: [] }))

    expect(mockMarkerLayerRef.current).toBeNull()
  })

  it('removes previous marker layer when features change', () => {
    const removeMock = vi.fn()

    mockMarkerLayerRef.current = {
      remove: removeMock,
    } as unknown as Layer

    renderHook(() => useAddMarkersToMap({ ...defaultProps, features: containerAssets }))

    expect(removeMock).toHaveBeenCalled()
  })

  it('does not add markers if features have no geometry or non-Point geometry', () => {
    const invalidFeatures = [
      {
        geometry: null,
        id: '1',
      },
      {
        geometry: { coordinates: [], type: 'LineString' },
        id: '2',
      },
    ] as unknown as Feature[]

    renderHook(() => useAddMarkersToMap({ ...defaultProps, features: invalidFeatures }))

    const markers = (mockMarkerLayerRef.current as unknown as MarkerClusterGroup).getLayers()

    expect(markers.length).toBe(0)
  })

  it('adds markers to the map and sets markerLayerRef', () => {
    renderHook(() => useAddMarkersToMap({ ...defaultProps, features: containerAssets }))

    expect(mockMarkerLayerRef.current).not.toBeNull()
    // Should be a marker cluster group
    expect(typeof mockMarkerLayerRef.current?.addTo).toBe('function')
  })

  it('handles clicking a selected marker', () => {
    const onSelectedMarkersChangeMock = vi.fn()
    const onMaxMarkersReachedMock = vi.fn()
    const updateSelectedPointMock = vi.fn()

    renderHook(() =>
      useAddMarkersToMap({
        ...defaultProps,
        features: containerAssets,
        onMaxMarkersReached: onMaxMarkersReachedMock,
        onSelectedMarkersChange: onSelectedMarkersChangeMock,
        selectedMarkers: [containerAssets[0]],
        updateSelectedPoint: updateSelectedPointMock,
      }),
    )

    const markers = (mockMarkerLayerRef.current as unknown as MarkerClusterGroup).getLayers()
    const firstMarker = markers[1] // For some reason the first marker is second in this array
    firstMarker.fire('click')

    expect(onMaxMarkersReachedMock).toHaveBeenCalledWith(false)
    expect(onSelectedMarkersChangeMock).toHaveBeenCalledWith([])
    expect(updateSelectedPointMock).toHaveBeenCalledWith(undefined)
  })

  it('sets selected point to second marker when first selected marker is deselected', () => {
    const updateSelectedPointMock = vi.fn()

    renderHook(() =>
      useAddMarkersToMap({
        ...defaultProps,
        features: containerAssets,
        selectedMarkers: containerAssets,
        updateSelectedPoint: updateSelectedPointMock,
      }),
    )

    const markers = (mockMarkerLayerRef.current as unknown as MarkerClusterGroup).getLayers()
    const firstMarker = markers[1] // For some reason the first marker is second in this array
    firstMarker.fire('click')

    // @ts-expect-error coordinates always exist in mock data
    const mockCoords = [containerAssets[1].geometry.coordinates[1], containerAssets[1].geometry.coordinates[0]]

    expect(updateSelectedPointMock).toHaveBeenCalledWith({ lat: mockCoords[0], lng: mockCoords[1] })
  })

  it('handles clicking a unselected marker when at maxMarkers', () => {
    const onSelectedMarkersChangeMock = vi.fn()
    const onMaxMarkersReachedMock = vi.fn()
    const updateSelectedPointMock = vi.fn()

    renderHook(() =>
      useAddMarkersToMap({
        ...defaultProps,
        features: containerAssets,
        maxMarkers: 0,
        onMaxMarkersReached: onMaxMarkersReachedMock,
        onSelectedMarkersChange: onSelectedMarkersChangeMock,
        updateSelectedPoint: updateSelectedPointMock,
      }),
    )

    const markers = (mockMarkerLayerRef.current as unknown as MarkerClusterGroup).getLayers()
    const firstMarker = markers[1] // For some reason the first marker is second in this array
    firstMarker.fire('click')

    expect(onMaxMarkersReachedMock).toHaveBeenCalledWith(true)
    expect(onSelectedMarkersChangeMock).not.toHaveBeenCalled()
    expect(updateSelectedPointMock).not.toHaveBeenCalled()
  })

  it('handles clicking a unselected marker when not at maxMarkers', () => {
    const onSelectedMarkersChangeMock = vi.fn()
    const onMaxMarkersReachedMock = vi.fn()
    const updateSelectedPointMock = vi.fn()

    renderHook(() =>
      useAddMarkersToMap({
        ...defaultProps,
        features: containerAssets,
        onMaxMarkersReached: onMaxMarkersReachedMock,
        onSelectedMarkersChange: onSelectedMarkersChangeMock,
        updateSelectedPoint: updateSelectedPointMock,
      }),
    )

    const markers = (mockMarkerLayerRef.current as unknown as MarkerClusterGroup).getLayers()
    const firstMarker = markers[1] // For some reason the first marker is second in this array
    firstMarker.fire('click')

    // @ts-expect-error coordinates always exist in mock data
    const mockCoords = [containerAssets[0].geometry.coordinates[1], containerAssets[0].geometry.coordinates[0]]

    expect(onMaxMarkersReachedMock).not.toHaveBeenCalled()
    expect(onSelectedMarkersChangeMock).toHaveBeenCalledWith([containerAssets[0]])
    expect(updateSelectedPointMock).toHaveBeenCalledWith({ lat: mockCoords[0], lng: mockCoords[1] })
  })
})

describe('createClusterIcon', () => {
  it('creates a cluster icon with the correct properties and disables keyboard', () => {
    const mockCluster = {
      getChildCount: () => 7,
      options: {},
    } as unknown as L.MarkerCluster

    const icon = createClusterIcon(mockCluster)

    expect(mockCluster.options.keyboard).toBe(false)
    expect(icon.options.html).toBe('7')
    expect(icon.options.className).toBe('meldingen-cluster')
    expect(icon.options.iconSize).toEqual([70, 70])
    expect(icon.options.iconAnchor).toEqual([35, 35])
  })
})
