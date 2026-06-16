import { http, HttpResponse } from 'msw'

import { fetchAssets } from './fetchAssets'
import { containerAssetIds, containerAssets } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

describe('fetchAssets', () => {
  it('returns features for each asset', async () => {
    let callCount = 0
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => {
        const feature = containerAssets[callCount]
        callCount += 1
        return HttpResponse.json({ features: [feature] })
      }),
    )

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual(containerAssets)
  })

  it('returns an empty array when the asset list is empty', async () => {
    const result = await fetchAssets(1, 'container', [])

    expect(result).toEqual([])
  })

  it('logs an error and excludes the asset when the WFS endpoint fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json('Test error', { status: 500 })),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')
    expect(result).toEqual([])

    consoleSpy.mockRestore()
  })

  it('filters out assets when the WFS response has no features', async () => {
    server.use(http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json({ features: [] })))

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual([])
  })

  it('returns only successful assets when one WFS request fails', async () => {
    let callCount = 0
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => {
        callCount += 1
        if (callCount === 1) return HttpResponse.json('Test error', { status: 500 })
        return HttpResponse.json({ features: [containerAssets[1]] })
      }),
    )

    vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await fetchAssets(1, 'container', containerAssetIds)

    expect(result).toEqual([containerAssets[1]])
  })
})
