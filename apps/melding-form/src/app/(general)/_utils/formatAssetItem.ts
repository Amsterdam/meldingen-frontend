import type { AssetOutput, SimpleClassificationOutput } from '@meldingen/api-client'

export type AssetItem = {
  icon: {
    entry?: string
    folder?: string
  }
  id?: string
  label?: string
  subtype?: string
}

export const formatAssetItem = (classification: SimpleClassificationOutput, asset: AssetOutput): AssetItem => {
  if (!classification || !asset) {
    return {
      icon: {
        entry: undefined,
        folder: undefined,
      },
      id: undefined,
      label: undefined,
      subtype: undefined,
    }
  }

  const assetType = classification?.asset_type

  return {
    icon: {
      entry: assetType?.arguments?.icon_entry as string | undefined,
      folder: assetType?.arguments?.icon_folder as string | undefined,
    },
    id: asset.external_id,
    label: asset.label as string | undefined,
    subtype: asset.subtype,
  }
}
