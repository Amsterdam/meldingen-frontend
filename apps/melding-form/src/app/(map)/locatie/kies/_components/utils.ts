import type { Feature } from 'geojson'
import L from 'leaflet'

import {
  gftAfvalIcon,
  glasAfvalIcon,
  papierAfvalIcon,
  plasticAfvalIcon,
  restAfvalIcon,
  textielAfvalIcon,
} from './map-markers'

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

export const getFeatureIcon = (feature: AssetFeature): L.Icon => {
  const featureType = feature.properties?.fractie_omschrijving

  switch (featureType) {
    case 'Papier': {
      return papierAfvalIcon
    }
    case 'Glas': {
      return glasAfvalIcon
    }
    case 'Rest': {
      return restAfvalIcon
    }
    case 'Textiel': {
      return textielAfvalIcon
    }
    case 'Plastic': {
      return plasticAfvalIcon
    }
    case 'Gft': {
      return gftAfvalIcon
    }
    default:
      return restAfvalIcon
  }
}
