import type { Feature } from '@meldingen/api-client'

import { containerIconsSVG, containerTypes, getContainerAssetIconSVG } from './getContainerAssetIconSVG'

const makeFeature = (type: (typeof containerTypes)[number] | string): Feature => ({
  geometry: {
    coordinates: [0, 0],
    type: 'Point',
  },
  properties: {
    fractie_omschrijving: type,
  },
  type: 'Feature',
})

describe('getContainerAssetIconSVG', () => {
  containerTypes.forEach((type) => {
    it(`returns the correct SVG for type ${type}`, () => {
      const feature = makeFeature(type)
      const svg = getContainerAssetIconSVG(feature)

      expect(svg).toBe(containerIconsSVG[type])
    })
  })

  it('returns fallback SVG if feature has no properties', () => {
    const feature = { geometry: { coordinates: [0, 0], type: 'Point' }, type: 'Feature' } as Feature
    const svg = getContainerAssetIconSVG(feature)

    expect(svg).toBe('/afval/rest.svg')
  })
})
