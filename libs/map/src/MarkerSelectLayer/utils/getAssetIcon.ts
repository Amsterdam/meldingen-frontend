import type { Icon } from 'leaflet'

import { icon as LeafletIcon } from 'leaflet'

import type { Feature } from '@meldingen/api-client'

import styles from './getAssetIcon.module.css'

const getAssetIconSVG = (properties: Feature['properties'], { entry, folder }: { entry?: string; folder?: string }) => {
  const assetSubType = entry ? (properties?.[entry] as string) : undefined

  if (!folder || !assetSubType) {
    return '/asset-fallback.svg'
  }

  return `/${folder}/${assetSubType.toLowerCase()}.svg`
}

export const getAssetIcon = (
  feature: Feature,
  isSelected: boolean,
  iconConfig: { entry?: string; folder?: string },
): Icon => {
  const icon = LeafletIcon({
    iconAnchor: [22, 22],
    iconSize: [44, 44],
    iconUrl: getAssetIconSVG(feature.properties, iconConfig),
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
