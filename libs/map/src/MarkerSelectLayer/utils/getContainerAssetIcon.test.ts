import type { AssetFeature } from './getContainerAssetIcon'

import { containerTypes, getContainerAssetIcon } from './getContainerAssetIcon'

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
  }) as AssetFeature

describe('containerAssetIcons', () => {
  containerTypes.forEach((type) => {
    it(`returns the correct icon for type ${type}`, () => {
      const feature = makeFeature(type)
      const icon = getContainerAssetIcon(feature, false)

      expect(icon.options.iconUrl).toBe(`/afval/${type.toLowerCase()}.svg`)
    })
  })

  containerTypes.forEach((type) => {
    it(`returns the correct selected icon for type ${type}`, () => {
      const feature = makeFeature(type)
      const icon = getContainerAssetIcon(feature, true)

      expect(icon.options.iconUrl).toBe(`/afval/${type.toLowerCase()}.svg`)
      expect(icon.options.className).toContain('border')
      expect(icon.options.iconSize).toEqual([60, 60])
      expect(icon.options.iconAnchor).toEqual([34, 56])
    })
  })
})
