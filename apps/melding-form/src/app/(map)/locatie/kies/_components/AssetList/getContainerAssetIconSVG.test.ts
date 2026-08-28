import type { AssetItem } from '~/app/(general)/_utils/formatAssetItem'

import { containerIconsSVG, containerTypes, getContainerAssetIconSVG } from './getContainerAssetIconSVG'

const makeAssetItem = (type: (typeof containerTypes)[number] | string): AssetItem => ({
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
    it(`returns the correct SVG for type ${type}`, () => {
      const feature = makeAssetItem(type)
      const svg = getContainerAssetIconSVG(feature)

      expect(svg).toBe(containerIconsSVG[type])
    })
  })

  it('returns fallback SVG if feature has no sybtype', () => {
    const assetItem = makeAssetItem('') // Empty subtype

    const svg = getContainerAssetIconSVG(assetItem)

    expect(svg).toBe('/container/rest.svg')
  })
})
