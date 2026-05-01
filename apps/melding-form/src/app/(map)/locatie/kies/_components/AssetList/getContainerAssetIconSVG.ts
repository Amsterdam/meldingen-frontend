import type { Feature } from '@meldingen/api-client'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

export const containerIconsSVG: Record<(typeof containerTypes)[number], string> = {
  Gft: '/container/gft.svg',
  Glas: '/container/glas.svg',
  Papier: '/container/papier.svg',
  Plastic: '/container/plastic.svg',
  Rest: '/container/rest.svg',
  Textiel: '/container/textiel.svg',
}

export const getContainerAssetIconSVG = (feature: Feature): string => {
  const containerFeatureType = feature.properties?.fractie_omschrijving as (typeof containerTypes)[number]

  return containerIconsSVG[containerFeatureType] || '/container/rest.svg'
}
