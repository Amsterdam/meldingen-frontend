import { buildWfsLayer } from './buildWfsLayer'
import { updateWfsLayer } from './updateWfsLayer'

vi.mock('./buildWfsLayer', () => ({
  buildWfsLayer: vi.fn(),
}))

describe('updateWfsLayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mapInstance: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let assetLayerRef: { current: any }

  beforeEach(() => {
    assetLayerRef = { current: null }
    mapInstance = {
      getZoom: vi.fn(),
    }
    vi.clearAllMocks()
  })

  it('returns undefined if mapInstance is falsy', () => {
    updateWfsLayer(null as any, assetLayerRef, 'container')

    expect(buildWfsLayer).not.toHaveBeenCalled()
  })

  it('returns undefined if classification is falsy', () => {
    updateWfsLayer(mapInstance, assetLayerRef, undefined)

    expect(buildWfsLayer).not.toHaveBeenCalled()
  })

  it('returns undefined if classification is not in classificationsWithAssets', () => {
    updateWfsLayer(mapInstance, assetLayerRef, 'not-an-asset')

    expect(buildWfsLayer).not.toHaveBeenCalled()
  })

  it('calls buildWfsLayer if zoom >= threshold and classification matches', () => {
    mapInstance.getZoom.mockReturnValue(16)

    updateWfsLayer(mapInstance, assetLayerRef, 'container')

    expect(buildWfsLayer).toHaveBeenCalledWith(mapInstance, 'container', assetLayerRef)
  })

  it('calls buildWfsLayer if zoom > threshold and classification matches', () => {
    mapInstance.getZoom.mockReturnValue(17)

    updateWfsLayer(mapInstance, assetLayerRef, 'container')

    expect(buildWfsLayer).toHaveBeenCalledWith(mapInstance, 'container', assetLayerRef)
  })

  it('removes assetLayer if zoom < threshold and assetLayerRef.current exists', () => {
    mapInstance.getZoom.mockReturnValue(15)
    assetLayerRef.current = { remove: vi.fn() }

    updateWfsLayer(mapInstance, assetLayerRef, 'container')

    expect(assetLayerRef.current.remove).toHaveBeenCalled()
    expect(buildWfsLayer).not.toHaveBeenCalled()
  })

  it('does nothing if zoom < threshold and assetLayerRef.current is null', () => {
    mapInstance.getZoom.mockReturnValue(15)
    assetLayerRef.current = null

    updateWfsLayer(mapInstance, assetLayerRef, 'container')

    expect(buildWfsLayer).not.toHaveBeenCalled()
  })
})
