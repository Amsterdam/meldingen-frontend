import { Feature } from '@meldingen/api-client'

import { containerTypes, getContainerIcon } from './getContainerIcon'

const makeFeature = (type: (typeof containerTypes)[number] | string) =>
  ({
    geometry: {
      coordinates: [0, 0],
      type: 'Point',
    },
    properties: {
      fractie_omschrijving: type,
    },
    type: 'Feature',
  }) as Feature

describe('containerIcons', () => {
  containerTypes.forEach((type) => {
    it(`returns the correct icon for type ${type}`, () => {
      const feature = makeFeature(type)
      const icon = getContainerIcon(feature, false)

      expect(icon.options.iconUrl).toBe(`/afval/${type.toLowerCase()}.svg`)
    })
  })

  containerTypes.forEach((type) => {
    it(`returns the correct selected icon for type ${type}`, () => {
      const feature = makeFeature(type)
      const icon = getContainerIcon(feature, true)

      expect(icon.options.iconUrl).toBe(`/afval/${type.toLowerCase()}.svg`)
      expect(icon.options.className).toContain('border')
      expect(icon.options.iconSize).toEqual([60, 60])
      expect(icon.options.iconAnchor).toEqual([34, 56])
    })
  })
})
