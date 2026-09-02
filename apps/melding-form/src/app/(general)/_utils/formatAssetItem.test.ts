import { describe, expect, it } from 'vitest'

import { formatAssetItem } from './formatAssetItem'
import { containerAssetIds, melding } from '~/mocks/data'

describe('formatAssetItem', () => {
  it('maps classification and asset data to an AssetItem', () => {
    const result = formatAssetItem(melding.classification!, containerAssetIds[0])

    expect(result).toEqual({
      icon: {
        entry: 'fractie_omschrijving',
        folder: 'container',
      },
      id: 'container.1',
      label: 'Restafval container - Container-001',
      subtype: 'Restafval',
    })
  })

  it('returns undefined icon fields when the classification has no asset type', () => {
    const classificationWithoutAssetType = {
      ...melding.classification!,
      asset_type: null,
    }

    const result = formatAssetItem(classificationWithoutAssetType, containerAssetIds[0])

    expect(result).toEqual({
      icon: {
        entry: undefined,
        folder: undefined,
      },
      id: 'container.1',
      label: 'Restafval container - Container-001',
      subtype: 'Restafval',
    })
  })

  it.each([
    ['classification is missing', null, containerAssetIds[0]],
    ['asset is missing', melding.classification!, null],
  ])('returns empty values when %s', (_description, classification, asset) => {
    const result = formatAssetItem(
      classification as Parameters<typeof formatAssetItem>[0],
      asset as Parameters<typeof formatAssetItem>[1],
    )

    expect(result).toEqual({
      icon: {
        entry: undefined,
        folder: undefined,
      },
      id: undefined,
      label: undefined,
      subtype: undefined,
    })
  })
})
