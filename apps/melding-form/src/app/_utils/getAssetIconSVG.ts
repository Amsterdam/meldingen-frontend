import type { AssetItem } from '~/app/(general)/_utils/formatAssetItem'

import { ASSET_FALLBACK_SRC } from '~/constants'

const formatIconPath = (icon: AssetItem['icon'], assetTypeName?: string): string => {
  if (!icon?.folder || !assetTypeName) {
    return ASSET_FALLBACK_SRC
  }

  return `/${icon.folder}/${assetTypeName.toLowerCase()}.svg`
}

export const getAssetIconSVG = (asset: AssetItem): string => formatIconPath(asset.icon, asset.subtype)
