import L from 'leaflet'

import { Feature } from '@meldingen/api-client'

import {
  gftAfvalIcon,
  glasAfvalIcon,
  papierAfvalIcon,
  plasticAfvalIcon,
  restAfvalIcon,
  textielAfvalIcon,
} from '../../markerIcons'

import styles from './getContainerIcon.module.css'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

const containerIcons: Record<(typeof containerTypes)[number], L.Icon> = {
  Gft: gftAfvalIcon,
  Glas: glasAfvalIcon,
  Papier: papierAfvalIcon,
  Plastic: plasticAfvalIcon,
  Rest: restAfvalIcon,
  Textiel: textielAfvalIcon,
}

export const getContainerIcon = (feature: Feature, isSelected: boolean): L.Icon => {
  const containerType = feature.properties?.fractie_omschrijving as (typeof containerTypes)[number]

  const icon = containerIcons[containerType] || restAfvalIcon

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
