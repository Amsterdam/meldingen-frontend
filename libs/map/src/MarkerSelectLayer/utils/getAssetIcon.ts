import type { Icon } from 'leaflet'

import { icon as LeafletIcon } from 'leaflet'

import { Feature } from '@meldingen/api-client'

import styles from './getAssetIcon.module.css'

const getAssetIconSVG = (
  properties: Feature['properties'],
  { iconEntry, iconFolder }: { iconEntry?: string; iconFolder?: string },
) => {
  const assetSubType = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetSubType) {
    return '/asset-fallback.svg'
  }

  return `/${iconFolder}/${assetSubType.toLowerCase()}.svg`
}

export const getAssetIcon = (
  feature: Feature,
  isSelected: boolean,
  assetTypeIconConfig: { iconEntry?: string; iconFolder?: string },
): Icon => {
  const icon = LeafletIcon({
    iconAnchor: [22, 22],
    iconSize: [44, 44],
    iconUrl: getAssetIconSVG(feature.properties, assetTypeIconConfig),
  })

  if (isSelected) {
    return LeafletIcon({
      className: styles.border,
      iconAnchor: [34, 34],
      iconSize: [60, 60],
      iconUrl: icon.options.iconUrl,
    })
  }

  return icon
}
