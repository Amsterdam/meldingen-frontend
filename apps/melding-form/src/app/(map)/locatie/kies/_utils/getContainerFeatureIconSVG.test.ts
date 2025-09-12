import type { Feature } from '@meldingen/api-client'

import { ContainerFeatureType } from './getContainerFeatureIcon'
import { getContainerFeatureIconSVG } from './getContainerFeatureIconSVG'

const makeFeature = (type: ContainerFeatureType | string): Feature => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [0, 0],
  },
  properties: {
    fractie_omschrijving: type,
  },
})

describe('getContainerFeatureIconSVG', () => {
  it.each([
    [ContainerFeatureType.Papier, '/afval/papier.svg'],
    [ContainerFeatureType.Glas, '/afval/glas.svg'],
    [ContainerFeatureType.Rest, '/afval/restafval.svg'],
    [ContainerFeatureType.Textiel, '/afval/textiel.svg'],
    [ContainerFeatureType.Plastic, '/afval/plastic.svg'],
    [ContainerFeatureType.GFT, '/afval/gft.svg'],
    ['UnknownType', '/afval/restafval.svg'], // fallback case
  ])('returns correct SVG for type %s', (type, expectedSvg) => {
    const feature = makeFeature(type)
    const svg = getContainerFeatureIconSVG(feature)

    expect(svg).toBe(expectedSvg)
  })

  it('returns fallback SVG if feature has no properties', () => {
    const feature = { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } } as Feature
    const svg = getContainerFeatureIconSVG(feature)

    expect(svg).toBe('/afval/restafval.svg')
  })
})
