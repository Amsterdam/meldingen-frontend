import L from 'leaflet'
import type { MutableRefObject } from 'react'

import type { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { getContainerFeatureIcon } from './getContainerFeatureIcon'

vi.mock('./getContainerFeatureIcon', () => ({
  getContainerFeatureIcon: vi.fn(),
}))

describe('addAssetLayerToMap', () => {
  let mapInstance: L.Map
  let assetLayerRef: MutableRefObject<L.Layer | null>

  beforeEach(() => {
    // Create a dummy map instance
    const container = document.createElement('div')
    mapInstance = L.map(container)
    assetLayerRef = { current: null }
  })

  afterEach(() => {
    mapInstance.remove()
  })

  it('should remove the previous asset layer if it exists', () => {
    const removeMock = vi.fn()
    assetLayerRef.current = { remove: removeMock } as unknown as L.Layer
    addAssetLayerToMap([], assetLayerRef, mapInstance)
    expect(removeMock).toHaveBeenCalled()
  })

  it('should add a new geoJSON layer to the map', () => {
    const features: Feature[] = [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [4.9, 52.3] },
        properties: {},
      } as Feature,
    ]
    addAssetLayerToMap(features, assetLayerRef, mapInstance)
    expect(assetLayerRef.current).not.toBeNull()
    // Check that the layer is on the map
    expect(mapInstance.hasLayer(assetLayerRef.current!)).toBe(true)
  })

  it('should use getFeatureIcon for each feature', () => {
    const features: Feature[] = [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [4.9, 52.3] },
        properties: {},
      } as Feature,
    ]
    addAssetLayerToMap(features, assetLayerRef, mapInstance)
    expect(getContainerFeatureIcon).toHaveBeenCalledWith(features[0])
  })
})
