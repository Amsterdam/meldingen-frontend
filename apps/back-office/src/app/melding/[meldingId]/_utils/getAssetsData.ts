import type { MeldingOutput } from '~/app/_api-client/proxy'

import { getMeldingByMeldingIdAssets } from '~/app/_api-client/proxy'

export const getAssetsData = async (data: MeldingOutput, meldingId: number) => {
  const { data: assetIds, error: assetIdError } = await getMeldingByMeldingIdAssets({
    path: { melding_id: meldingId },
  })

  if (assetIdError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(assetIdError)
    return { assets: [] }
  }

  return {
    assets: assetIds,
    assetsTerm: data.classification?.asset_type?.arguments?.term as string | undefined,
  }
}
