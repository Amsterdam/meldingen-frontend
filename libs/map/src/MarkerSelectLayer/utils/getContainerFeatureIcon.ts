import type { Feature } from 'geojson'

import L from 'leaflet'

import {
  gftAfvalIcon,
  glasAfvalIcon,
  papierAfvalIcon,
  plasticAfvalIcon,
  restAfvalIcon,
  textielAfvalIcon,
} from '../../markerIcons'

import styles from './getContainerFeatureIcon.module.css'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

export type AssetFeature = Feature & {
  properties: { fractie_omschrijving: (typeof containerTypes)[number] & { [name: string]: string | boolean | null } }
}

const containerIcons: Record<(typeof containerTypes)[number], L.Icon> = {
  Gft: gftAfvalIcon,
  Glas: glasAfvalIcon,
  Papier: papierAfvalIcon,
  Plastic: plasticAfvalIcon,
  Rest: restAfvalIcon,
  Textiel: textielAfvalIcon,
}

export const getContainerFeatureIcon = (feature: AssetFeature, isSelected: boolean): L.Icon => {
  const containerFeatureType = feature.properties?.fractie_omschrijving as (typeof containerTypes)[number]

  const icon = containerIcons[containerFeatureType] || restAfvalIcon

  if (isSelected) {
    return L.icon({
      ...icon.options,
      className: styles.border,
      iconAnchor: [34, 56],
      iconSize: [60, 60],
    })
  }

  return icon
}
