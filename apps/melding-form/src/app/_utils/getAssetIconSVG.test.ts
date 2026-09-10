import type { AssetItem } from '~/app/(general)/_utils/formatAssetItem'

import { getAssetIconSVG } from './getAssetIconSVG'

export const containerTypes = ['Papier', 'Glas', 'Rest', 'Textiel', 'Plastic', 'Gft'] as const

const makeAssetItem = (type: string): AssetItem => ({
  icon: {
    entry: 'subtype',
    folder: 'container',
  },
  id: '1',
  label: 'Test Asset',
  subtype: type,
})

describe('getContainerAssetIconSVG', () => {
  containerTypes.forEach((type) => {
    it(`returns the correct SVG for type: ${type}`, () => {
      const feature = makeAssetItem(type)
      const svg = getAssetIconSVG(feature)

      expect(svg).toBe(`/container/${type.toLowerCase()}.svg`)
    })
  })

  it('returns fallback SVG if feature has no subtype', () => {
    const assetItem = makeAssetItem('') // Empty subtype

    const svg = getAssetIconSVG(assetItem)

    expect(svg).toBe('/asset-fallback.svg')
  })
})
