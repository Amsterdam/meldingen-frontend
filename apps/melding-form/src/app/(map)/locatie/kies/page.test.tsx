import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page, { generateMetadata } from './page'
import { SelectLocation } from './SelectLocation'
import { containerAssets, melding } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./SelectLocation', () => ({
  SelectLocation: vi.fn(() => <div>SelectLocation Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('renders the SelectLocation component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('SelectLocation Component')).toBeInTheDocument()
  })

  it('logs an error to the console when melding data cannot be fetched', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json('Test error', { status: 500 })),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const PageComponent = await Page()

    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()
  })

  it('passes coordinates to SelectLocation when they already exist', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    const [lat, lng] = melding.geo_location?.geometry?.coordinates || []

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        coordinates: { lat, lng },
      }),
      undefined,
    )
  })

  it('fetches assetIds from melding and passes assets to SelectLocation', async () => {
    let callCount = 0
    server.use(
      http.get(ENDPOINTS.GET_WFS_BY_NAME, () => {
        callCount += 1

        if (callCount === 1) {
          return HttpResponse.json({
            features: [containerAssets[0]],
          })
        } else {
          return HttpResponse.json({
            features: [containerAssets[1]],
          })
        }
      }),
    )

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: containerAssets,
      }),
      undefined,
    )
  })

  it('logs an error when fetches assetIds from melding fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ASSETS_MELDER, () =>
        HttpResponse.json('Test error', { status: 500 }),
      ),
    )
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const PageComponent = await Page()
    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('logs an error when the wfs endpoint fails', async () => {
    server.use(http.get(ENDPOINTS.GET_WFS_BY_NAME, () => HttpResponse.json('Test error', { status: 500 })))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const PageComponent = await Page()
    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('deletes assets from melding', async () => {
    const mockGetWfsByName = vi.fn()

    server.use(
      http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, (req) => {
        mockGetWfsByName(req)

        return HttpResponse.json('Test error', { status: 500 })
      }),
    )

    const PageComponent = await Page()
    render(PageComponent)

    expect(mockGetWfsByName).toHaveBeenCalledTimes(2)
  })

  it('logs an error when delete assets from melding fails', async () => {
    server.use(
      http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, () =>
        HttpResponse.json('Test error', { status: 500 }),
      ),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const PageComponent = await Page()
    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()
  })
})
