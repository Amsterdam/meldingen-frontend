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

  beforeEach(() => {
    assetLayerRef = { current: null }
    mapInstance = {
      getZoom: vi.fn(),
    }
  })

  it('returns undefined if classification is falsy', () => {
    updateAssetLayer(mapInstance, assetLayerRef, undefined)

    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('returns undefined if classification is not in classificationsWithAssets', () => {
    updateAssetLayer(mapInstance, assetLayerRef, 'not-an-asset')

    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('calls fetchAndAddAssetLayerToMap if zoom >= threshold and classification matches', () => {
    mapInstance.getZoom.mockReturnValue(16)

    updateAssetLayer(mapInstance, assetLayerRef, 'container')

    expect(fetchAndAddAssetLayerToMap).toHaveBeenCalledWith(mapInstance, 'container', assetLayerRef)
  })

  it('calls fetchAndAddAssetLayerToMap if zoom > threshold and classification matches', () => {
    mapInstance.getZoom.mockReturnValue(17)

    updateAssetLayer(mapInstance, assetLayerRef, 'container')

    expect(fetchAndAddAssetLayerToMap).toHaveBeenCalledWith(mapInstance, 'container', assetLayerRef)
  })

  it('removes assetLayer if zoom < threshold and assetLayerRef.current exists', () => {
    mapInstance.getZoom.mockReturnValue(15)
    assetLayerRef.current = { remove: vi.fn() }

    updateAssetLayer(mapInstance, assetLayerRef, 'container')

    expect(assetLayerRef.current.remove).toHaveBeenCalled()
    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('does nothing if zoom < threshold and assetLayerRef.current is null', () => {
    mapInstance.getZoom.mockReturnValue(15)
    assetLayerRef.current = null

    updateAssetLayer(mapInstance, assetLayerRef, 'container')

    expect(fetchAndAddAssetLayerToMap).not.toHaveBeenCalled()
  })
})
