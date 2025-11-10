import type { Feature } from '@meldingen/api-client'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

export const containerIconsSVG: Record<(typeof containerTypes)[number], string> = {
  Papier: '/afval/papier.svg',
  Glas: '/afval/glas.svg',
  Rest: '/afval/rest.svg',
  Textiel: '/afval/textiel.svg',
  Plastic: '/afval/plastic.svg',
  Gft: '/afval/gft.svg',
}

export const getContainerFeatureIconSVG = (feature: Feature): string => {
  const containerFeatureType = feature.properties?.fractie_omschrijving as (typeof containerTypes)[number]

  return containerIconsSVG[containerFeatureType] || '/afval/rest.svg'
}
