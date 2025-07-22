import L from 'leaflet'
import { http, HttpResponse } from 'msw'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { buildWfsLayer } from './buildWfsLayer'
import { getWfsFilter } from './getWfsFilter'
import { containerAsset } from '../../../../../../mocks/data'
import { handleApiError } from 'apps/melding-form/src/handleApiError'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./addAssetLayerToMap', () => ({
  addAssetLayerToMap: vi.fn(),
}))

vi.mock('./getWfsFilter', () => ({
  getWfsFilter: vi.fn(() => 'mock-filter'),
}))

vi.mock('apps/melding-form/src/handleApiError', () => ({
  handleApiError: vi.fn((e) => `Handled: ${e.message}`),
}))

describe('buildWfsLayer', () => {
  let mapInstance: L.Map
  let assetLayerRef: { current: L.Layer | null }

  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    // Create a dummy map instance
    const container = document.createElement('div')
    mapInstance = L.map(container)
    assetLayerRef = { current: null }
  })

  it('calls addAssetLayerToMap when features are returned', async () => {
    await buildWfsLayer(mapInstance, 'container', assetLayerRef)

    expect(addAssetLayerToMap).toHaveBeenCalledWith([containerAsset], assetLayerRef, mapInstance)
  })

  it('throws error when error is returned', async () => {
    await expect(buildWfsLayer(mapInstance, 'invalid-classification', assetLayerRef)).rejects.toThrow(
      'Handled: Something went wrong',
    )
    expect(handleApiError).toHaveBeenCalledWith({ message: 'Something went wrong' })
  })

  it('does not call addAssetLayerToMap if no features', async () => {
    server.use(http.get(ENDPOINTS.GET_WFS_BY_NAME, () => HttpResponse.json({ features: [] })))

    await buildWfsLayer(mapInstance, 'container', assetLayerRef)

    expect(addAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('calls getWfsFilter with mapInstance', async () => {
    await buildWfsLayer(mapInstance, 'container', assetLayerRef)

    expect(getWfsFilter).toHaveBeenCalledWith(mapInstance)
  })
})
