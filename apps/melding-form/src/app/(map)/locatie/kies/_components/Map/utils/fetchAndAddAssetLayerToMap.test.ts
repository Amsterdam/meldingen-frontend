import L from 'leaflet'
import { http, HttpResponse } from 'msw'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { fetchAndAddAssetLayerToMap } from './fetchAndAddAssetLayerToMap'
import { getWfsFilter } from './getWfsFilter'
import { containerAsset } from 'apps/melding-form/src/mocks/data'
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

describe('fetchAndAddAssetLayerToMap', () => {
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
    await fetchAndAddAssetLayerToMap(mapInstance, 'container', assetLayerRef)

    expect(addAssetLayerToMap).toHaveBeenCalledWith([containerAsset], assetLayerRef, mapInstance)
  })

  it('throws error when error is returned', async () => {
    const fn = () => fetchAndAddAssetLayerToMap(mapInstance, 'invalid-classification', assetLayerRef)

    await expect(fn).rejects.toThrow('Handled: Something went wrong')
  })

  it('does not call addAssetLayerToMap when there are no features', async () => {
    server.use(http.get(ENDPOINTS.GET_WFS_BY_NAME, () => HttpResponse.json({ features: [] })))

    await fetchAndAddAssetLayerToMap(mapInstance, 'container', assetLayerRef)

    expect(addAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('calls getWfsFilter with mapInstance', async () => {
    await fetchAndAddAssetLayerToMap(mapInstance, 'container', assetLayerRef)

    expect(getWfsFilter).toHaveBeenCalledWith(mapInstance)
  })
})
