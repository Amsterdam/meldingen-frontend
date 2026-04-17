import L from 'leaflet'

import { Feature } from '@meldingen/api-client'

import styles from './getAssetIcon.module.css'

export const getAssetIcon = (
  feature: Feature,
  isSelected: boolean,
  assetTypeIconConfig: {
    iconEntry?: string
    iconFolder?: string
  },
): L.Icon => {
  console.log('--- ~ iconEntry:', assetTypeIconConfig.iconEntry)
  const assetTypeCategorie = assetTypeIconConfig.iconEntry
    ? (feature.properties?.[assetTypeIconConfig.iconEntry] as string)
    : undefined

  const icon = L.icon({
    iconAnchor: [22, 22],
    iconSize: [44, 44],
    iconUrl: `/${assetTypeIconConfig.iconFolder}/${assetTypeCategorie?.toLocaleLowerCase()}.svg`,
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
