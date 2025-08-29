import L from 'leaflet'
import type { MutableRefObject } from 'react'

import { addAssetLayerToMap, type Props } from './addAssetLayerToMap'
import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('./getContainerFeatureIcon', () => ({
  getContainerFeatureIcon: vi.fn(),
}))

const defaultProps: Props = {
  assetLayerRef: { current: null } as MutableRefObject<L.Layer | null>,
  assetList: containerAssets,
  mapInstance: {} as L.Map,
  AssetMarkersRef: { current: {} } as MutableRefObject<Record<string, L.Marker>>,
  selectedAssets: [],
  setSelectedAssets: vi.fn(),
  setCoordinates: vi.fn(),
}

describe('addAssetLayerToMap', () => {
  beforeEach(() => {
    const container = document.createElement('div')
    defaultProps.mapInstance = L.map(container)
  })

  afterEach(() => {
    defaultProps.mapInstance.remove()
  })

  it('should remove the previous asset layer if it exists', () => {
    const removeMock = vi.fn()
    defaultProps.assetLayerRef.current = { remove: removeMock } as unknown as L.Layer
    addAssetLayerToMap({ ...defaultProps })

    expect(removeMock).toHaveBeenCalled()
  })

  it('should add a new geoJSON layer to the map', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.assetLayerRef.current).not.toBeNull()
    // Check that the layer is on the map
    expect(defaultProps.mapInstance.hasLayer(defaultProps.assetLayerRef.current!)).toBe(true)
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

    const marker = defaultProps.AssetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalledWith(expect.any(Function))
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
    })
  })

  it('should not add more than MAX_ASSETS when marker is clicked', () => {
    const maxAssets = Array(5).fill(containerAssets[0])

    addAssetLayerToMap({ ...defaultProps, selectedAssets: maxAssets })

    const marker = defaultProps.AssetMarkersRef.current[containerAssets[0].id!]

    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalledWith(expect.any(Function))
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
  })

  it('should remove asset from selectedAssets and unset coordinates when marker is clicked and already selected', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

    const marker = defaultProps.AssetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalledWith(expect.any(Function))
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
  })

  it('should assign marker to AssetMarkersRef using feature id', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.AssetMarkersRef.current[containerAssets[0].id!]).toBeInstanceOf(L.Marker)
  })

  it('should not assign marker to AssetMarkersRef if feature id is undefined', () => {
    const assetWithoutId = { ...containerAssets[0], id: undefined }

    addAssetLayerToMap({
      ...defaultProps,
      assetList: [assetWithoutId],
    })

    expect(defaultProps.AssetMarkersRef.current[undefined as any]).toBeUndefined()
  })
})
