import L from 'leaflet'
import { http, HttpResponse } from 'msw'

import { Feature } from '@meldingen/api-client'

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
  let mockSetAssetList: (assets: Feature[]) => void

  beforeEach(() => {
    // Create a dummy map instance
    const container = document.createElement('div')
    mapInstance = L.map(container)
    assetLayerRef = { current: null }
    mockSetAssetList = vi.fn()
  })

  afterEach(() => {
    mapInstance.remove()
  })

  it('calls addAssetLayerToMap and mockSetAssetLayer when features are returned', async () => {
    await fetchAndAddAssetLayerToMap(mapInstance, 'container', assetLayerRef, mockSetAssetList)

    expect(addAssetLayerToMap).toHaveBeenCalledWith([containerAsset], assetLayerRef, mapInstance)
    expect(mockSetAssetList).toHaveBeenCalledWith([containerAsset])
  })

  it('throws error when error is returned', async () => {
    const fn = () => fetchAndAddAssetLayerToMap(mapInstance, 'invalid-classification', assetLayerRef, mockSetAssetList)

    await expect(fn).rejects.toThrow('Handled: Something went wrong')
  })

  it('does not call addAssetLayerToMap and reset mockSetAssetLayer when there are no features', async () => {
    server.use(http.get(ENDPOINTS.GET_WFS_BY_NAME, () => HttpResponse.json({ features: [] })))

    await fetchAndAddAssetLayerToMap(mapInstance, 'container', assetLayerRef, mockSetAssetList)

    expect(mockSetAssetList).toHaveBeenCalledWith([])
    expect(addAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('calls getWfsFilter with mapInstance', async () => {
    await fetchAndAddAssetLayerToMap(mapInstance, 'container', assetLayerRef, mockSetAssetList)

    expect(getWfsFilter).toHaveBeenCalledWith(mapInstance)
  })
})
