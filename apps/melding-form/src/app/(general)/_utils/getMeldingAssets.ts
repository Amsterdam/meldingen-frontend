import type { SimpleClassificationOutput } from '@meldingen/api-client'

import { getMeldingByMeldingIdAssetsMelder, getMeldingByMeldingIdMelder } from '@meldingen/api-client'

import { formatAssetItem } from './formatAssetItem'

export const getMeldingAssets = async (meldingId: string, token: string) => {
  const meldingIdInt = Number(meldingId)

  const [{ data: rawAssets, error: assetIdError }, { data: melding, error: meldingError }] = await Promise.all([
    getMeldingByMeldingIdAssetsMelder({ path: { melding_id: meldingIdInt }, query: { token } }),
    getMeldingByMeldingIdMelder({ path: { melding_id: meldingIdInt }, query: { token } }),
  ])

  if (assetIdError || meldingError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(assetIdError ?? meldingError)
    return { assets: [], pageConfig: undefined, requiredErrorMessage: undefined }
  }

  const assetType = melding.classification?.asset_type
  const assetTypeId = assetType?.id
  const typeNames = assetType?.arguments?.type_names as string | undefined

  if (!assetTypeId || !typeNames) {
    return {
      assets: [],
      pageConfig: undefined,
      requiredErrorMessage: undefined,
    }
  }

  const assets = rawAssets
    .map((asset) => formatAssetItem(melding.classification as SimpleClassificationOutput, asset))
    .filter((asset) => asset !== null)

  return {
    assets,
    pageConfig: {
      description: assetType?.arguments?.location_description as string | undefined,
      label: assetType?.arguments?.location_label as string | undefined,
      name: assetType?.name as string | undefined,
    },
    requiredErrorMessage: assetType?.arguments?.location_required_error as string | undefined,
  }
}
