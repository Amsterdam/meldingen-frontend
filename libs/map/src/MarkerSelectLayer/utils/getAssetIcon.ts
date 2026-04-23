import L from 'leaflet'

import { Feature } from '@meldingen/api-client'

import styles from './getAssetIcon.module.css'

const getAssetIconSVG = (
  properties: Feature['properties'],
  { iconEntry, iconFolder }: { iconEntry?: string; iconFolder?: string },
) => {
  const assetSubType = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetSubType) {
    return '/happy.png'
  }

  return `/${iconFolder}/${assetSubType?.toLocaleLowerCase()}.svg`
}

export const getAssetIcon = (
  feature: Feature,
  isSelected: boolean,
  assetTypeIconConfig: { iconEntry?: string; iconFolder?: string },
): L.Icon => {
  const icon = L.icon({
    iconAnchor: [22, 22],
    iconSize: [44, 44],
    iconUrl: getAssetIconSVG(feature.properties, assetTypeIconConfig),
  })

  if (isSelected) {
    return L.icon({
      ...icon.options,
      className: styles.border,
      iconAnchor: [34, 34],
      iconSize: [60, 60],
    })
  }

  return icon
}
