import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  markers: [],
  maxMarkers: 5,
  selectedMarkers: [],
  onMarkersChange: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  updateSelectedPoint: vi.fn(),
  onMaxMarkersReached: vi.fn(),
}

describe('MarkerSelectLayer', () => {
  it('returns undefined', () => {
    const { container } = render(<MarkerSelectLayer {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })
})

// describe('addAssetLayerToMap', () => {
//   beforeEach(() => {
//     const container = document.createElement('div')
//     defaultProps.mapInstance = L.map(container)
//     defaultProps.assetLayerRef = {
//       current: { remove: removeMock } as unknown as L.Layer,
//     } as RefObject<L.Layer | null>
//   })

//   it('returns early when mapInstance is not provided', () => {
//     const result = addAssetLayerToMap({ ...defaultProps, mapInstance: null })

//     expect(result).toBeUndefined()
//     expect(removeMock).not.toBeCalled()
//   })

//   it('returns early when there are no assets', () => {
//     const result = addAssetLayerToMap({ ...defaultProps, assetList: [] })

//     expect(result).toBeUndefined()
//     expect(removeMock).not.toBeCalled()
//   })

//   it('removes the previous asset layer if it exists', () => {
//     addAssetLayerToMap({ ...defaultProps })

//     expect(removeMock).toHaveBeenCalledOnce()
//   })

//   it('adds a new geoJSON layer to the map', () => {
//     addAssetLayerToMap({ ...defaultProps })

//     expect(defaultProps.mapInstance?.hasLayer(defaultProps.assetLayerRef.current!)).toBe(true)
//   })

//   it('calls getContainerFeatureIcon for each feature', () => {
//     addAssetLayerToMap({ ...defaultProps })

//     expect(getContainerFeatureIcon).toHaveBeenCalledWith(containerAssets[0], false)
//   })

//   it('uses selectedAssetIcon for selected feature', () => {
//     addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

//     expect(getContainerFeatureIcon).toHaveBeenCalledWith(containerAssets[0], true)
//   })

//   it('sets selectedAssets and coordinates when marker is clicked and not selected', () => {
//     addAssetLayerToMap({ ...defaultProps })

//     const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
//     marker.fire('click')

//     expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
//     expect(defaultProps.setCoordinates).toHaveBeenCalledWith({
//       lat: marker.getLatLng().lat,
//       lng: marker.getLatLng().lng,
//     })
//   })

//   it('does not add more than MAX_ASSETS when marker is clicked', () => {
//     const assetList = Array(6)
//       .fill(containerAssets[0])
//       .map((asset, index) => ({ ...asset, id: (index + 1).toString() }))
//     const maxAssets = Array(5)
//       .fill(containerAssets[0])
//       .map((asset, index) => ({ ...asset, id: (index + 1).toString() }))

//     addAssetLayerToMap({ ...defaultProps, selectedAssets: maxAssets, assetList })

//     const marker = defaultProps.assetMarkersRef.current['6']

//     marker.fire('click')

//     expect(defaultProps.setSelectedAssets).not.toHaveBeenCalled()
//     expect(defaultProps.setCoordinates).not.toHaveBeenCalled()
//   })

//   it('resets notification and coordinates and removes asset from selectedAssets when a selected marker is clicked', () => {
//     addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

//     const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
//     marker.fire('click')

//     expect(defaultProps.setNotificationType).toBeCalledWith(null)
//     expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
//     expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
//   })

//   it('resets coordinates when last selected asset is deselected by clicking marker', () => {
//     addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

//     const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
//     marker.fire('click')

//     expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
//     expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
//   })

//   it('sets address to second last selected asset when last selected asset is deselected by clicking marker', () => {
//     addAssetLayerToMap({ ...defaultProps, selectedAssets: containerAssets })

//     const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
//     marker.fire('click')

//     // @ts-expect-error an asset always has coordinates
//     const [y, x] = containerAssets[1].geometry.coordinates

//     expect(defaultProps.setCoordinates).toHaveBeenCalledWith({ lat: x, lng: y })
//     expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
//   })

//   it('assigns marker to assetMarkersRef using feature id', () => {
//     addAssetLayerToMap({ ...defaultProps })

//     expect(defaultProps.assetMarkersRef.current[containerAssets[0].id!]).toBeInstanceOf(L.Marker)
//   })

//   it('creates cluster icons with correct properties and disables keyboard', () => {
//     // Create a mock cluster object
//     const mockCluster = {
//       getChildCount: () => 7,
//       options: {},
//     } as unknown as L.MarkerCluster

//     const icon = createClusterIcon(mockCluster)

//     expect(mockCluster.options.keyboard).toBe(false)
//     expect(icon.options.html).toBe('7')
//     expect(icon.options.className).toBe('meldingen-cluster')
//     expect(icon.options.iconSize).toEqual([70, 70])
//     expect(icon.options.iconAnchor).toEqual([35, 35])
//   })

//   it('skips features without geometry or with non-Point geometry', () => {
//     const assetList = [
//       { ...containerAssets[0], geometry: null },
//       {
//         ...containerAssets[0],
//         geometry: {
//           type: 'LineString',
//           coordinates: [
//             [0, 0],
//             [1, 1],
//           ],
//         },
//       },
//       { ...containerAssets[0], geometry: { type: 'Point', coordinates: [1, 2] } },
//     ] as Feature[]

//     const assetMarkersRef = { current: {} } as RefObject<Record<string, L.Marker>>

//     addAssetLayerToMap({
//       ...defaultProps,
//       assetList,
//       assetMarkersRef,
//     })

//     // Only the Point geometry should result in a marker
//     expect(Object.keys(assetMarkersRef.current)).toHaveLength(1)
//     expect(assetMarkersRef.current[assetList[2].id!]).toBeInstanceOf(L.Marker)
//   })
// })

// describe('fetchAssets', () => {
//   it('returns undefined if classification is undefined', async () => {
//     const result = await fetchAssets({ ...defaultProps, classification: undefined })

//     expect(result).toBeUndefined()
//     expect(defaultProps.mapInstance.getZoom).not.toHaveBeenCalled()
//   })

//   it('does not fetch assets if classification has no asset support', async () => {
//     const result = await fetchAssets({ ...defaultProps, classification: 'invalid-classification' })

//     expect(result).toBeUndefined()
//     expect(defaultProps.mapInstance.getZoom).not.toHaveBeenCalled()
//   })

//   it('does not fetch assets if map is hidden', async () => {
//     const hiddenMapInstance = {
//       ...mockMapInstance,
//       getSize: vi.fn(() => ({ x: 0, y: 0 })),
//     } as unknown as L.Map

//     const result = await fetchAssets({ ...defaultProps, mapInstance: hiddenMapInstance })

//     expect(result).toBeUndefined()
//     expect(defaultProps.mapInstance.getZoom).not.toHaveBeenCalled()
//   })

//   it('calls setAssetList with fetched assets', async () => {
//     await fetchAssets(defaultProps)

//     expect(defaultProps.setAssetList).toHaveBeenCalledWith(containerAssets)
//   })

//   it('throws an error if the API call fails', async () => {
//     server.use(
//       http.get(ENDPOINTS.GET_WFS_BY_NAME, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
//     )

//     await expect(fetchAssets(defaultProps)).rejects.toThrow('Error message')
//   })

//   it('calls setAssetsList with empty array and remove layer if zoom is below threshold', async () => {
//     const lowZoomMapInstance = {
//       ...mockMapInstance,
//       getZoom: vi.fn(() => 15),
//     } as unknown as L.Map

//     const mockAssetLayerRef = { current: { remove: vi.fn() } as unknown as L.Layer }

//     await fetchAssets({
//       ...defaultProps,
//       mapInstance: lowZoomMapInstance,
//       assetLayerRef: mockAssetLayerRef,
//     })

//     expect(defaultProps.setAssetList).toHaveBeenCalledWith([])
//     expect(mockAssetLayerRef.current?.remove).toBeCalled()
//   })
// })

// describe('updateAssetMarkers', () => {
//   it('does not update markers if mapInstance is null', () => {
//     const result = updateAssetMarkers({ ...defaultProps, mapInstance: null })

//     expect(result).toBeUndefined()
//   })

//   it('does not update markers if assetMarkersRef is empty', () => {
//     const result = updateAssetMarkers({ ...defaultProps, assetMarkersRef: { current: {} } })

//     expect(result).toBeUndefined()
//   })

//   it('sets selectedAssetsIcon for selected assets', () => {
//     updateAssetMarkers(defaultProps)

//     expect(defaultProps.assetMarkersRef.current['1'].setIcon).toHaveBeenCalledWith({ icon: 'container-selected' })
//   })

//   it('sets container icon for unselected assets', () => {
//     updateAssetMarkers(defaultProps)

//     expect(defaultProps.assetMarkersRef.current['2'].setIcon).toHaveBeenCalledWith({ icon: 'container' })
//   })
// })
