import L from 'leaflet'
import type { MutableRefObject } from 'react'

import { addAssetLayerToMap, MAX_ASSETS, type Props } from './addAssetLayerToMap'
import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('./getContainerFeatureIcon', () => ({
  getContainerFeatureIcon: vi.fn(),
}))

const removeMock = vi.fn()

const defaultProps: Props = {
  assetLayerRef: {} as MutableRefObject<L.Layer | null>,
  assetList: containerAssets,
  assetMarkersRef: { current: {} } as MutableRefObject<Record<string, L.Marker>>,
  mapInstance: {} as L.Map,
  notification: null,
  selectedAssets: [],
  setCoordinates: vi.fn(),
  setNotification: vi.fn(),
  setSelectedAssets: vi.fn(),
  t: vi.fn(),
}

const mockNotification = {
  closeButtonLabel: 'Sluiten',
  heading: `U kunt maximaal ${MAX_ASSETS} containers kiezen`,
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

  it('removes the previous asset layer if it exists', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(removeMock).toHaveBeenCalledOnce()
  })

  it('adds a new geoJSON layer to the map', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.mapInstance?.hasLayer(defaultProps.assetLayerRef.current!)).toBe(true)
  })

  it('calls getContainerFeatureIcon for each feature', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(getContainerFeatureIcon).toHaveBeenCalledWith(containerAssets[0], false)
  })

  it('uses selectedAssetIcon for selected feature', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

    expect(getContainerFeatureIcon).toHaveBeenCalledWith(containerAssets[0], true)
  })

  it('sets selectedAssets and coordinates when marker is clicked and not selected', () => {
    addAssetLayerToMap({ ...defaultProps })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
    })
  })

  it('does not add more than MAX_ASSETS when marker is clicked', () => {
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

  it('resets notification and coordinates and removes asset from selectedAssets when a selected marker is clicked', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]], notification: mockNotification })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setNotification).toBeCalledWith(null)
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
  })

  it('resets coordinates when last selected asset is deselected by clicking marker', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: [containerAssets[0]] })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(undefined)
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
  })

  it('sets address to second last selected asset when last selected asset is deselected by clicking marker', () => {
    addAssetLayerToMap({ ...defaultProps, selectedAssets: containerAssets })

    const marker = defaultProps.assetMarkersRef.current[containerAssets[0].id!]
    marker.fire('click')

    // @ts-expect-error an asset always has coordinates
    const [y, x] = containerAssets[1].geometry.coordinates

    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({ lat: x, lng: y })
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
  })

  it('assigns marker to assetMarkersRef using feature id', () => {
    addAssetLayerToMap({ ...defaultProps })

    expect(defaultProps.assetMarkersRef.current[containerAssets[0].id!]).toBeInstanceOf(L.Marker)
  })
})
