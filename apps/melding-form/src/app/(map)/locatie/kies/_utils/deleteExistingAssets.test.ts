import { http, HttpResponse } from 'msw'

import { deleteExistingAssets } from './deleteExistingAssets'
import { containerAssetIds } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

describe('deleteExistingAssets', () => {
  it('calls the delete endpoint for each asset', async () => {
    const mockDelete = vi.fn(() => new HttpResponse())
    server.use(http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, mockDelete))

    await deleteExistingAssets(123, 'test-token', containerAssetIds)

    expect(mockDelete).toHaveBeenCalledTimes(containerAssetIds.length)
  })

  it('does nothing when the assets list is empty', async () => {
    const mockDelete = vi.fn(() => new HttpResponse())
    server.use(http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, mockDelete))

    await deleteExistingAssets(123, 'test-token', [])

    expect(mockDelete).not.toHaveBeenCalled()
  })

  it('logs an error when a delete request fails', async () => {
    server.use(
      http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, () =>
        HttpResponse.json('Test error', { status: 500 }),
      ),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await deleteExistingAssets(123, 'test-token', containerAssetIds)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()
  })

  it('continues deleting remaining assets when one delete request fails', async () => {
    const mockDelete = vi.fn()
    let callCount = 0

    server.use(
      http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, () => {
        callCount += 1
        mockDelete()
        if (callCount === 1) return HttpResponse.json('Test error', { status: 500 })
        return new HttpResponse()
      }),
    )

    vi.spyOn(console, 'error').mockImplementation(() => {})

    await deleteExistingAssets(123, 'test-token', containerAssetIds)

    expect(mockDelete).toHaveBeenCalledTimes(containerAssetIds.length)
  })
})
