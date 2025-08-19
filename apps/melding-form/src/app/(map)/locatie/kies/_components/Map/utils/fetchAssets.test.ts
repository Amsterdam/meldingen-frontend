import L from 'leaflet'

import { fetchAssets } from './fetchAssets'
import { containerAsset } from 'apps/melding-form/src/mocks/data'

vi.mock('./getWfsFilter', () => ({
  getWfsFilter: vi.fn(() => 'mock-filter'),
}))

vi.mock('apps/melding-form/src/handleApiError', () => ({
  handleApiError: vi.fn((e) => `Handled: ${e.message}`),
}))

describe('fetchAssets', () => {
  let mapInstance: L.Map

  beforeEach(() => {
    const container = document.createElement('div')
    mapInstance = L.map(container)
  })

  afterEach(() => {
    mapInstance.remove()
  })

  it('should fetch assets with correct filter', async () => {
    const result = await fetchAssets(mapInstance, 'container')

    expect(result).toEqual({ features: [containerAsset] })
  })

  it('should throw an error if the API call fails', async () => {
    await expect(fetchAssets(mapInstance, 'invalid-classification')).rejects.toThrow('Handled: Something went wrong')
  })
})
