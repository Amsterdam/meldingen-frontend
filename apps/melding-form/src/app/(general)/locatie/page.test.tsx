import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Location } from './Location'
import Page from './page'
import { COOKIES } from 'apps/melding-form/src/constants'
import { containerAssets } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockCookies, mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./Location', () => ({
  Location: vi.fn(() => <div>Location Component</div>),
}))

describe('Page', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('renders Location component with default props when cookies are not set', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith(expect.objectContaining({ address: undefined, prevPage: '/' }), undefined)
  })

  it('renders Location component with props from cookies', async () => {
    mockCookies({
      [COOKIES.ADDRESS]: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam',
      [COOKIES.ID]: '123',
      [COOKIES.LAST_PANEL_PATH]: '/previous',
      [COOKIES.TOKEN]: 'test-token',
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith(
      expect.objectContaining({ address: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam', prevPage: '/previous' }),
      undefined,
    )
  })

  it('fetches and passes saved assets to Location component', async () => {
    let callCount = 0
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => {
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

    expect(Location).toHaveBeenCalledWith(expect.objectContaining({ selectedAssets: containerAssets }), undefined)
  })

  it('returns empty selectedAssets when no assets are found', async () => {
    server.use(http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json({ features: [] })))

    const PageComponent = await Page()
    render(PageComponent)

    expect(Location).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
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

    expect(Location).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('logs an error when the wfs endpoint fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json('Test error', { status: 500 })),
    )
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const PageComponent = await Page()
    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()

    expect(Location).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })
})
