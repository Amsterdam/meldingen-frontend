import type { MeldingOutput } from '~/app/_api-client/proxy'

import { getMeldingByMeldingIdAssets } from '~/app/_api-client/proxy'

export const getAssetsData = async (data: MeldingOutput, meldingId: number) => {
  const { data: assets, error: assetsError } = await getMeldingByMeldingIdAssets({
    path: { melding_id: meldingId },
  })

  if (assetsError) throw new Error('Failed to fetch assets.')

  return {
    assets,
    assetsTerm: data.classification?.asset_type?.arguments?.term as string | undefined,
  }
}
