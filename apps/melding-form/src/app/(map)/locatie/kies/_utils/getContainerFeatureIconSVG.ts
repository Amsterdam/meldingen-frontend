import type { Feature } from '@meldingen/api-client'

import { ContainerFeatureType } from './getContainerFeatureIcon'

const containerIconsSVG: Record<ContainerFeatureType, string> = {
  [ContainerFeatureType.Papier]: '/afval/papier.svg',
  [ContainerFeatureType.Glas]: '/afval/glas.svg',
  [ContainerFeatureType.Rest]: '/afval/restafval.svg',
  [ContainerFeatureType.Textiel]: '/afval/textiel.svg',
  [ContainerFeatureType.Plastic]: '/afval/plastic.svg',
  [ContainerFeatureType.GFT]: '/afval/gft.svg',
}

export const getContainerFeatureIconSVG = (feature: Feature): string => {
  const containerFeatureType = feature.properties?.fractie_omschrijving as ContainerFeatureType

  return containerIconsSVG[containerFeatureType] || '/afval/restafval.svg'
}
