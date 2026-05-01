import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page, { generateMetadata } from './page'
import { SelectLocation } from './SelectLocation'
import { containerAssets, melding } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockIdAndTokenCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./SelectLocation', () => ({
  SelectLocation: vi.fn(() => <div>SelectLocation Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'title - organisation-name' })
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

  it('returns empty selectedAssets when assetTypeId is not available', async () => {
    const meldingWithoutAssetTypeId = {
      ...melding,
      classification: {
        ...melding.classification,
        asset_type: {
          ...melding.classification?.asset_type,
          id: undefined,
        },
      },
    }
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(meldingWithoutAssetTypeId)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('returns empty selectedAssets when typeNames is not available', async () => {
    const meldingWithoutTypeNames = {
      ...melding,
      classification: {
        ...melding.classification,
        asset_type: {
          ...melding.classification?.asset_type,
          arguments: {
            ...melding.classification?.asset_type?.arguments,
            type_names: undefined,
          },
        },
      },
    }
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(meldingWithoutTypeNames)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('logs an error and does not return assets when fetching assetIds from melding returns an error', async () => {
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

  it('logs an error when deleting assets from melding returns an error', async () => {
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

  it('logs an error and does not return assets when the WFS endpoint returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json('Test error', { status: 500 })),
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

  it('deletes existing assets from melding', async () => {
    const mockGetWfsByAssetTypeId = vi.fn()

    server.use(http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID, mockGetWfsByAssetTypeId))

    const PageComponent = await Page()
    render(PageComponent)

    expect(mockGetWfsByAssetTypeId).toHaveBeenCalledTimes(2)
  })

  it('filters out assets when the WFS response has no features', async () => {
    server.use(http.get(ENDPOINTS.GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS, () => HttpResponse.json({ features: [] })))

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: [],
      }),
      undefined,
    )
  })

  it('fetches assetIds from melding and passes assets to SelectLocation', async () => {
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

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssets: containerAssets,
      }),
      undefined,
    )
  })

  it('passes maxAssets from melding classification.asset_type.max_assets when it exists', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAssets: 5,
      }),
      undefined,
    )
  })

  it('passes filter, typeNames and srsName when they exist', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(melding)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        wfsQuery: expect.objectContaining({
          assetTypeId: melding.classification?.asset_type?.id,
          filter: melding.classification?.asset_type?.arguments?.filter,
          srsName: melding.classification?.asset_type?.arguments?.srs_name,
          typeNames: melding.classification?.asset_type?.arguments?.type_names,
        }),
      }),
      undefined,
    )
  })

  it('passes assetTypeIconConfig when it exists', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(melding)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        assetTypeIconConfig: {
          iconEntry: 'fractie_omschrijving',
          iconFolder: 'container',
        },
      }),
      undefined,
    )
  })

  it('falls back to maxAssets=3 when the API does not provide it', async () => {
    const meldingWithAssetType = {
      ...melding,
      classification: {
        ...melding.classification,
        asset_type: { max_assets: undefined },
      },
    }

    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(meldingWithAssetType)))

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAssets: 3,
      }),
      undefined,
    )
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
})
