import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Location } from './Location'
import Page from './page'
import { COOKIES } from '~/constants'
import { containerAssets, melding } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockCookies, mockIdAndTokenCookies } from '~/mocks/utils'

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

  it('returns an empty array of selectedAssets and logs an error when fetching assets fails', async () => {
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

  it('returns an empty array of selectedAssets and logs an error when fetching melding fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json('Test error', { status: 500 })),
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

  it('returns an empty array of selectedAssets when assetTypeId is not set', async () => {
    const meldingwithoutAssetTypeId = {
      ...melding,
      classification: {
        ...melding.classification,
        asset_type: null,
      },
    }
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(meldingwithoutAssetTypeId)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(Location).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('returns an empty array of selectedAssets when typeNames is not set', async () => {
    const meldingwithoutTypeNames = {
      ...melding,
      classification: {
        ...melding.classification,
        asset_type: {
          ...melding.classification?.asset_type,
          arguments: {
            type_names: null,
          },
        },
      },
    }
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(meldingwithoutTypeNames)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(Location).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('logs an error and does not return assets when the WFS endpoint returns an error', async () => {
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

  it('does not return assets when no assets are found', async () => {
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
})
