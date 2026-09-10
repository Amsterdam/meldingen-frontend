import { http, HttpResponse } from 'msw'

import { getAssetsData } from './getAssetsData'
import { asset, melding } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 123

describe('getAssetsData', () => {
  it('returns assets and assetsTerm when classification has an asset_type with a term', async () => {
    const meldingWithTerm = {
      ...melding,
      classification: {
        ...melding.classification!,
        asset_type: {
          arguments: { term: 'Klokken' },
          class_name: 'KlokAsset',
          created_at: '2025-02-18T10:34:29.103642',
          id: 1,
          max_assets: 5,
          name: 'Klok',
          updated_at: '2025-02-18T10:34:40.730569',
        },
      },
    }

    const result = await getAssetsData(meldingWithTerm, mockMeldingId)

    expect(result).toEqual({
      assets: [asset],
      assetsTerm: 'Klokken',
    })
  })

  it('returns assets with undefined assetsTerm when classification has no asset_type', async () => {
    const result = await getAssetsData(melding, mockMeldingId)

    expect(result).toEqual({
      assets: [asset],
      assetsTerm: undefined,
    })
  })

  it('returns empty assets array and undefined assetsTerm when getMeldingByMeldingIdAssets returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ASSETS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getAssetsData(melding, mockMeldingId)

    expect(result).toEqual({ assets: [], assetsTerm: undefined })
  })
})
