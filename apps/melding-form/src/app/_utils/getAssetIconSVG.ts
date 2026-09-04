import type { AssetItem } from '~/app/(general)/_utils/formatAssetItem'

const formatIconPath = (icon: AssetItem['icon'], assetTypeName?: string): string => {
  if (!icon?.folder || !assetTypeName) {
    return '/asset-fallback.svg'
  }

  return `/${icon.folder}/${assetTypeName.toLowerCase()}.svg`
}

export const getAssetIconSVG = (asset: AssetItem): string => formatIconPath(asset.icon, asset.subtype)
