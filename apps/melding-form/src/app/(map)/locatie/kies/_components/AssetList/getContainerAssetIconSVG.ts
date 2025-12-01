import type { Feature } from '@meldingen/api-client'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

export const containerIconsSVG: Record<(typeof containerTypes)[number], string> = {
  Gft: '/afval/gft.svg',
  Glas: '/afval/glas.svg',
  Papier: '/afval/papier.svg',
  Plastic: '/afval/plastic.svg',
  Rest: '/afval/rest.svg',
  Textiel: '/afval/textiel.svg',
}

export const getContainerAssetIconSVG = (feature: Feature): string => {
  const containerFeatureType = feature.properties?.fractie_omschrijving as (typeof containerTypes)[number]

  return containerIconsSVG[containerFeatureType] || '/afval/rest.svg'
}
