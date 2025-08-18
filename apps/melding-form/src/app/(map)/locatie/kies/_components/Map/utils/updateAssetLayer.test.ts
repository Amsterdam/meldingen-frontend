import { Feature } from '@meldingen/api-client'

import { fetchAndAddAssetLayerToMap } from './fetchAndAddAssetLayerToMap'
import { updateAssetLayer } from './updateAssetLayer'

vi.mock('./fetchAndAddAssetLayerToMap', () => ({
  fetchAndAddAssetLayerToMap: vi.fn(),
}))

describe('updateAssetLayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mapInstance: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let assetLayerRef: { current: any }

  let mockSetAssetList: (assets: Feature[]) => void

  beforeEach(() => {
    assetLayerRef = { current: null }
    mapInstance = {
      getZoom: vi.fn(),
    }
    mockSetAssetList = vi.fn()
  })

  it('returns undefined if classification is falsy', () => {
    updateAssetLayer(mapInstance, assetLayerRef, mockSetAssetList, undefined)

    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('returns undefined if classification is not in classificationsWithAssets', () => {
    updateAssetLayer(mapInstance, assetLayerRef, mockSetAssetList, 'not-an-asset')

    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('calls fetchAndAddAssetLayerToMap if zoom >= threshold and classification matches', () => {
    mapInstance.getZoom.mockReturnValue(16)

    updateAssetLayer(mapInstance, assetLayerRef, mockSetAssetList, 'container')

    expect(fetchAndAddAssetLayerToMap).toHaveBeenCalledWith(mapInstance, 'container', assetLayerRef, mockSetAssetList)
  })

  it('calls fetchAndAddAssetLayerToMap if zoom > threshold and classification matches', () => {
    mapInstance.getZoom.mockReturnValue(17)

    updateAssetLayer(mapInstance, assetLayerRef, mockSetAssetList, 'container')

    expect(fetchAndAddAssetLayerToMap).toHaveBeenCalledWith(mapInstance, 'container', assetLayerRef, mockSetAssetList)
  })

  it('removes assetLayer if zoom < threshold and assetLayerRef.current exists', () => {
    mapInstance.getZoom.mockReturnValue(15)
    assetLayerRef.current = { remove: vi.fn() }

    updateAssetLayer(mapInstance, assetLayerRef, mockSetAssetList, 'container')

    expect(assetLayerRef.current.remove).toHaveBeenCalled()
    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('does nothing if zoom < threshold and assetLayerRef.current is null', () => {
    mapInstance.getZoom.mockReturnValue(15)
    assetLayerRef.current = null

    updateAssetLayer(mapInstance, assetLayerRef, mockSetAssetList, 'container')

    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })
})
