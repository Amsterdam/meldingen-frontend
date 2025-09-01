import L from 'leaflet'
import type { MutableRefObject } from 'react'

import { addAssetLayerToMap, type Props } from './addAssetLayerToMap'
import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('./getContainerFeatureIcon', () => ({
  getContainerFeatureIcon: vi.fn(),
}))

const removeMock = vi.fn()

const defaultProps: Props = {
  assetLayerRef: {} as MutableRefObject<L.Layer | null>,
  assetList: containerAssets,
  mapInstance: {} as L.Map,
  assetMarkersRef: { current: {} } as MutableRefObject<Record<string, L.Marker>>,
  selectedAssets: [],
  setSelectedAssets: vi.fn(),
  setCoordinates: vi.fn(),
}

describe('addAssetLayerToMap', () => {
  beforeEach(() => {
    const container = document.createElement('div')
    defaultProps.mapInstance = L.map(container)
    defaultProps.assetLayerRef = {
      current: { remove: removeMock } as unknown as L.Layer,
    } as MutableRefObject<L.Layer | null>
  })

  it('returns early when mapInstance is not provided', () => {
    const result = addAssetLayerToMap({ ...defaultProps, mapInstance: null })

    expect(result).toBeUndefined()
    expect(removeMock).not.toBeCalled()
  })

  it('returns early when there are no assets', () => {
    const result = addAssetLayerToMap({ ...defaultProps, assetList: [] })

    expect(result).toBeUndefined()
    expect(removeMock).not.toBeCalled()
  })

  it('should remove the previous asset layer if it exists', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(removeMock).toHaveBeenCalledOnce()
  })

  it('should add a new geoJSON layer to the map', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.mapInstance?.hasLayer(defaultProps.assetLayerRef.current!)).toBe(true)
  })

  it('should call getContainerFeatureIcon for each feature', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(getContainerFeatureIcon).toHaveBeenCalledWith(containerAssets[0])
  })

  it('should use defaultIcon for selected feature', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

    expect(getContainerFeatureIcon).not.toHaveBeenCalledWith(containerAssets[0])
  })

  it('should set selectedAssets and coordinates when marker is clicked and not selected', () => {
    addAssetLayerToMap({ ...defaultProps })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
    })
  })

  it('should not add more than MAX_ASSETS when marker is clicked', () => {
    const assetList = Array(6)
      .fill(containerAssets[0])
      .map((asset, index) => ({ ...asset, id: (index + 1).toString() }))
    const maxAssets = Array(5)
      .fill(containerAssets[0])
      .map((asset, index) => ({ ...asset, id: (index + 1).toString() }))

    addAssetLayerToMap({ ...defaultProps, selectedAssets: maxAssets, assetList })

    const marker = defaultProps.assetMarkersRef.current['6']

    marker.fire('click')

    expect(defaultProps.setSelectedAssets).not.toHaveBeenCalled()
    expect(defaultProps.setCoordinates).not.toHaveBeenCalled()
  })

  it('should remove asset from selectedAssets and unset coordinates when marker is clicked and already selected', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
  })

  it('should assign marker to assetMarkersRef using feature id', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.assetMarkersRef.current[containerAssets[0].id!]).toBeInstanceOf(L.Marker)
  })
})
