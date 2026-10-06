import { http, HttpResponse } from 'msw'

import { fetchAssets } from './fetchAssets'
import { containerAssetIds, containerAssets } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

describe('fetchAssets', () => {
  it('returns features for each asset', async () => {
    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual(containerAssets)
  })

  it('returns features in the same order as the asset ids', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () =>
        HttpResponse.json({ features: [containerAssets[1], containerAssets[0]] }),
      ),
    )

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual(containerAssets)
  })

  it('returns an empty array without fetching when the asset list is empty', async () => {
    const mockWfsRequest = vi.fn()

    server.use(http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, mockWfsRequest))

    const result = await fetchAssets(1, 'container', [])

    expect(result).toEqual([])
    expect(mockWfsRequest).not.toHaveBeenCalled()
  })

  it('logs an error and returns an empty array when the WFS endpoint fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json('Test error', { status: 500 })),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')
    expect(result).toEqual([])

    consoleSpy.mockRestore()
  })

  it('returns an empty array when the WFS response has no features', async () => {
    server.use(http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json({ features: [] })))

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual([])
  })

  it('returns only the assets that are in the WFS response', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () =>
        HttpResponse.json({ features: [containerAssets[1]] }),
      ),
    )

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual([containerAssets[1]])
  })
})
