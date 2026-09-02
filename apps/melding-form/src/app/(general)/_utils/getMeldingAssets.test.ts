import type { AssetTypeOutput, SimpleClassificationOutput } from '@meldingen/api-client'

import { getMeldingByMeldingIdAssetsMelder } from '@meldingen/api-client'

import { formatAssetItem } from './formatAssetItem'
import { getMeldingAssets } from './getMeldingAssets'
import { containerAssetIds, melding } from '~/mocks/data'

vi.mock('@meldingen/api-client', () => ({
  getMeldingByMeldingIdAssetsMelder: vi.fn(),
}))

vi.mock('./formatAssetItem', () => ({
  formatAssetItem: vi.fn(),
}))

const getMeldingByMeldingIdAssetsMelderMock = vi.mocked(getMeldingByMeldingIdAssetsMelder)
const formatAssetItemMock = vi.mocked(formatAssetItem)

const apiError = { detail: 'Test error' }
const meldingWithAssetType = {
  ...melding,
  classification: {
    ...melding.classification,
    asset_type: {
      ...melding.classification?.asset_type,
      arguments: {
        ...melding.classification?.asset_type?.arguments,
      },
    },
  },
}

describe('getMeldingAssets', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches asset ids, formats valid assets, and returns page config', async () => {
    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: containerAssetIds,
      error: undefined,
      response: {} as never,
    } as never)

    formatAssetItemMock
      .mockReturnValueOnce({
        icon: { entry: 'fractie_omschrijving', folder: 'container' },
        id: 'container.1',
        label: 'Asset 1',
        subtype: 'containers',
      })
      .mockReturnValueOnce({
        icon: { entry: 'fractie_omschrijving', folder: 'container' },
        id: 'container.2',
        label: 'Asset 2',
        subtype: 'containers',
      })

    const result = await getMeldingAssets('123', 'test-token', melding.classification as SimpleClassificationOutput)

    expect(getMeldingByMeldingIdAssetsMelderMock).toHaveBeenCalledWith({
      path: { melding_id: 123 },
      query: { token: 'test-token' },
    })

    expect(formatAssetItemMock).toHaveBeenNthCalledWith(1, melding.classification, containerAssetIds[0])
    expect(formatAssetItemMock).toHaveBeenNthCalledWith(2, melding.classification, containerAssetIds[1])

    expect(result).toEqual({
      assets: [
        {
          icon: { entry: 'fractie_omschrijving', folder: 'container' },
          id: 'container.1',
          label: 'Asset 1',
          subtype: 'containers',
        },
        {
          icon: { entry: 'fractie_omschrijving', folder: 'container' },
          id: 'container.2',
          label: 'Asset 2',
          subtype: 'containers',
        },
      ],
      pageConfig: {
        description: undefined,
        label: undefined,
        name: 'container',
      },
      requiredErrorMessage: undefined,
    })
  })

  it('filters out null formatted assets', async () => {
    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: containerAssetIds,
      error: undefined,
      response: {} as never,
    } as never)

    formatAssetItemMock
      .mockImplementationOnce(() => null as never)
      .mockReturnValueOnce({
        icon: { entry: 'fractie_omschrijving', folder: 'container' },
        id: 'container.2',
        label: 'Asset 2',
        subtype: 'containers',
      })

    const result = await getMeldingAssets('123', 'test-token', melding.classification as SimpleClassificationOutput)

    expect(result.assets).toEqual([
      {
        icon: { entry: 'fractie_omschrijving', folder: 'container' },
        id: 'container.2',
        label: 'Asset 2',
        subtype: 'containers',
      },
    ])
  })

  it('returns empty results and logs the asset request error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: undefined,
      error: apiError,
      response: {} as never,
    } as never)
    const result = await getMeldingAssets('123', 'test-token', melding.classification as SimpleClassificationOutput)

    expect(consoleSpy).toHaveBeenCalledWith(apiError)
    expect(formatAssetItemMock).not.toHaveBeenCalled()
    expect(result).toEqual({ assets: [], pageConfig: undefined, requiredErrorMessage: undefined })

    consoleSpy.mockRestore()
  })

  it('returns empty results when the melding has no asset type id', async () => {
    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: containerAssetIds,
      error: undefined,
      response: {} as never,
    } as never)

    const result = await getMeldingAssets('123', 'test-token', {
      ...(meldingWithAssetType.classification as SimpleClassificationOutput),
      asset_type: null,
    })

    expect(formatAssetItemMock).not.toHaveBeenCalled()
    expect(result).toEqual({ assets: [], pageConfig: undefined, requiredErrorMessage: undefined })
  })

  it('returns empty results when the asset type has no type_names', async () => {
    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: containerAssetIds,
      error: undefined,
      response: {} as never,
    } as never)

    const result = await getMeldingAssets('123', 'test-token', {
      ...(meldingWithAssetType.classification as SimpleClassificationOutput),
      asset_type: {
        ...meldingWithAssetType.classification.asset_type!,
        arguments: {
          ...meldingWithAssetType.classification.asset_type!.arguments,
          type_names: undefined,
        },
      } as AssetTypeOutput,
    })

    expect(formatAssetItemMock).not.toHaveBeenCalled()
    expect(result).toEqual({ assets: [], pageConfig: undefined, requiredErrorMessage: undefined })
  })

  it('returns location page configuration and required error message when provided by the asset type', async () => {
    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: [],
      error: undefined,
      response: {} as never,
    } as never)

    const result = await getMeldingAssets('123', 'test-token', {
      ...(meldingWithAssetType.classification as SimpleClassificationOutput),
      asset_type: {
        ...meldingWithAssetType.classification.asset_type!,
        arguments: {
          ...meldingWithAssetType.classification.asset_type!.arguments,
          location_description: 'Choose a location',
          location_label: 'Selecteer locatie',
          location_required_error: 'Locatie is verplicht',
        },
        name: 'Containerlocatie',
      } as AssetTypeOutput,
    })

    expect(result).toEqual({
      assets: [],
      pageConfig: {
        description: 'Choose a location',
        label: 'Selecteer locatie',
        name: 'Containerlocatie',
      },
      requiredErrorMessage: 'Locatie is verplicht',
    })
  })

  it('returns empty results when classification is missing', async () => {
    getMeldingByMeldingIdAssetsMelderMock.mockResolvedValue({
      data: containerAssetIds,
      error: undefined,
      response: {} as never,
    } as never)

    const result = await getMeldingAssets('123', 'test-token')

    expect(formatAssetItemMock).not.toHaveBeenCalled()
    expect(result).toEqual({
      assets: [],
      pageConfig: undefined,
      requiredErrorMessage: undefined,
    })
  })
})
