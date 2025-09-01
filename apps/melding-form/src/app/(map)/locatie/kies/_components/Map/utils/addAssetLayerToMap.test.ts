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
  assetLayerRef: { current: { remove: removeMock } as unknown as L.Layer } as MutableRefObject<L.Layer | null>,
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
  })

  afterEach(() => {
    defaultProps.mapInstance?.remove()
  })

  it('should return early if mapInstance is not provided or when there are no assets', () => {
    const result = addAssetLayerToMap({ ...defaultProps, mapInstance: null })

    expect(result).toBeUndefined()
    expect(defaultProps.assetLayerRef.current?.remove).not.toBeCalled()

    const secondResult = addAssetLayerToMap({ ...defaultProps, assetList: [] })

    expect(secondResult).toBeUndefined()
    expect(defaultProps.assetLayerRef.current?.remove).not.toBeCalled()
  })

  it('should remove the previous asset layer if it exists', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(removeMock).toHaveBeenCalled()
  })

  it('should add a new geoJSON layer to the map', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.assetLayerRef.current).not.toBeNull()
    // Check that the layer is on the map
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

    expect(defaultProps.setSelectedAssets).toHaveBeenCalledWith(expect.any(Function))
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
    })
  })

  it('should not add more than MAX_ASSETS when marker is clicked', () => {
    const maxAssets = Array(5).fill(containerAssets[0])

    addAssetLayerToMap({ ...defaultProps, selectedAssets: maxAssets })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]

    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalledWith(expect.any(Function))
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
  })

  it('should remove asset from selectedAssets and unset coordinates when marker is clicked and already selected', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalledWith(expect.any(Function))
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
  })

  it('should assign marker to assetMarkersRef using feature id', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.assetMarkersRef.current[containerAssets[0].id!]).toBeInstanceOf(L.Marker)
  })

  it('should not assign marker to assetMarkersRef if feature id is undefined', () => {
    const assetWithoutId = { ...containerAssets[0], id: undefined }

    addAssetLayerToMap({
      ...defaultProps,
      assetList: [assetWithoutId],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(defaultProps.assetMarkersRef.current[undefined as any]).toBeUndefined()
  })
})
