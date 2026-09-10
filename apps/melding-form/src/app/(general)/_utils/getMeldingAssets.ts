import type { SimpleClassificationOutput } from '@meldingen/api-client'

import { getMeldingByMeldingIdAssetsMelder } from '@meldingen/api-client'

import { formatAssetItem } from './formatAssetItem'

export const getMeldingAssets = async (
  meldingId: string,
  token: string,
  classification?: SimpleClassificationOutput | null,
) => {
  const meldingIdInt = Number(meldingId)

  const assetType = classification?.asset_type
  const assetTypeId = assetType?.id
  const typeNames = assetType?.arguments?.type_names as string | undefined

  if (!assetTypeId || !typeNames) {
    return {
      assets: [],
      meta: undefined,
      requiredErrorMessage: undefined,
    }
  }

  const { data: rawAssets, error: assetIdError } = await getMeldingByMeldingIdAssetsMelder({
    path: { melding_id: meldingIdInt },
    query: { token },
  })

  if (assetIdError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(assetIdError)
    return { assets: [], meta: undefined, requiredErrorMessage: undefined }
  }

  const assets = rawAssets
    .map((asset) => formatAssetItem(classification as SimpleClassificationOutput, asset))
    .filter((asset) => asset !== null)

  return {
    assets,
    meta: {
      asset: {
        name: assetType?.name as string | undefined,
      },
      location: {
        description: assetType?.arguments?.location_description as string | undefined,
        label: assetType?.arguments?.location_label as string | undefined,
      },
    },
    requiredErrorMessage: assetType?.arguments?.location_required_error as string | undefined,
  }
}
