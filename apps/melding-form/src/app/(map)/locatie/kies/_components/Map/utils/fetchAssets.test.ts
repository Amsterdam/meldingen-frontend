import L from 'leaflet'
import { http, HttpResponse } from 'msw'

import { fetchAssets, type Props } from './fetchAssets'
import { containerAssets } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./getWfsFilter', () => ({
  getWfsFilter: vi.fn(() => 'mock-filter'),
}))

const mockMapInstance = {
  getSize: vi.fn(() => ({ x: 800, y: 600 })),
  getZoom: vi.fn(() => 16),
} as unknown as L.Map

const defaultProps: Props = {
  mapInstance: mockMapInstance,
  classification: 'container',
  setAssetList: vi.fn(),
  assetLayerRef: { current: null },
}

describe('fetchAssets', () => {
  it('returns undefined if classification is undefined', async () => {
    const result = await fetchAssets({ ...defaultProps, classification: undefined })

    expect(result).toBeUndefined()
    expect(defaultProps.mapInstance.getZoom).not.toHaveBeenCalled()
  })

  it('does not fetch assets if classification has no asset support', async () => {
    const result = await fetchAssets({ ...defaultProps, classification: 'invalid-classification' })

    expect(result).toBeUndefined()
    expect(defaultProps.mapInstance.getZoom).not.toHaveBeenCalled()
  })

  it('does not fetch assets if map is hidden', async () => {
    const hiddenMapInstance = {
      ...mockMapInstance,
      getSize: vi.fn(() => ({ x: 0, y: 0 })),
    } as unknown as L.Map

    const result = await fetchAssets({ ...defaultProps, mapInstance: hiddenMapInstance })

    expect(result).toBeUndefined()
    expect(defaultProps.mapInstance.getZoom).not.toHaveBeenCalled()
  })

  it('calls setAssetList with fetched assets', async () => {
    await fetchAssets(defaultProps)

    expect(defaultProps.setAssetList).toHaveBeenCalledWith(containerAssets)
  })

  it('throws an error if the API call fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_WFS_BY_NAME, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
    )

    await expect(fetchAssets(defaultProps)).rejects.toThrow('Error message')
  })

  it('calls setAssetsList with empty array and remove layer if zoom is below threshold', async () => {
    const lowZoomMapInstance = {
      ...mockMapInstance,
      getZoom: vi.fn(() => 15),
    } as unknown as L.Map

    const mockAssetLayerRef = { current: { remove: vi.fn() } as unknown as L.Layer }

    await fetchAssets({
      ...defaultProps,
      mapInstance: lowZoomMapInstance,
      assetLayerRef: mockAssetLayerRef,
    })

    expect(defaultProps.setAssetList).toHaveBeenCalledWith([])
    expect(mockAssetLayerRef.current?.remove).toBeCalled()
  })
})
