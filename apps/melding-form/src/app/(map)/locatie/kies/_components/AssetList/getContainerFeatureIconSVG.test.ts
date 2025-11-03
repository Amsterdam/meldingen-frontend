import type { Feature } from '@meldingen/api-client'

import { containerIconsSVG, containerTypes, getContainerFeatureIconSVG } from './getContainerFeatureIconSVG'

const makeFeature = (type: (typeof containerTypes)[number] | string): Feature => ({
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
  containerTypes.forEach((type) => {
    it(`returns the correct SVG for type ${type}`, () => {
      const feature = makeFeature(type)
      const svg = getContainerFeatureIconSVG(feature)

      expect(svg).toBe(containerIconsSVG[type])
    })
  })

  it('returns fallback SVG if feature has no properties', () => {
    const feature = { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } } as Feature
    const svg = getContainerFeatureIconSVG(feature)

    expect(svg).toBe('/afval/rest.svg')
  })
})
