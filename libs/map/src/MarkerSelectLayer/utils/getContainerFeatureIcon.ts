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

export enum ContainerFeatureType {
  Papier = 'Papier',
  Glas = 'Glas',
  Rest = 'Rest',
  Textiel = 'Textiel',
  Plastic = 'Plastic',
  GFT = 'Gft',
}

export type AssetFeature = Feature & {
  properties: { fractie_omschrijving: ContainerFeatureType & { [name: string]: string | boolean | null } }
}

const containerIcons: Record<ContainerFeatureType, L.Icon> = {
  [ContainerFeatureType.Papier]: papierAfvalIcon,
  [ContainerFeatureType.Glas]: glasAfvalIcon,
  [ContainerFeatureType.Rest]: restAfvalIcon,
  [ContainerFeatureType.Textiel]: textielAfvalIcon,
  [ContainerFeatureType.Plastic]: plasticAfvalIcon,
  [ContainerFeatureType.GFT]: gftAfvalIcon,
}

export const getContainerFeatureIcon = (feature: AssetFeature, isSelected: boolean): L.Icon => {
  const containerFeatureType = feature.properties?.fractie_omschrijving as ContainerFeatureType

  const icon = containerIcons[containerFeatureType] || restAfvalIcon

  if (isSelected) {
    return L.icon({
      ...icon.options,
      className: styles.border,
      iconSize: [60, 60],
      iconAnchor: [34, 56],
    })
  }

  return icon
}
