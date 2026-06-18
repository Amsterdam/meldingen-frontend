import type { AssetOutput } from '@meldingen/api-client'

import { deleteMeldingByMeldingIdAssetByAssetId } from '@meldingen/api-client'

export const deleteExistingAssets = async (meldingId: number, token: string, assetIds: AssetOutput[]) => {
  await Promise.all(
    assetIds.map(async (asset) => {
      const { error } = await deleteMeldingByMeldingIdAssetByAssetId({
        path: {
          asset_id: asset.id,
          melding_id: meldingId,
        },
        query: { token },
      })

      if (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }),
  )
}
