import type { AssetItem } from '~/app/(general)/_utils/formatAssetItem'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

export const containerIconsSVG: Record<(typeof containerTypes)[number], string> = {
  Gft: '/container/gft.svg',
  Glas: '/container/glas.svg',
  Papier: '/container/papier.svg',
  Plastic: '/container/plastic.svg',
  Rest: '/container/rest.svg',
  Textiel: '/container/textiel.svg',
}

export const getContainerAssetIconSVG = (asset: AssetItem): string => {
  const containerFeatureType = asset.subtype as (typeof containerTypes)[number]

  return containerIconsSVG[containerFeatureType] || '/container/rest.svg'
}
