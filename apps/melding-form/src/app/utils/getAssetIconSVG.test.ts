import type { Feature } from '@meldingen/api-client'

import { getAssetIconSVG } from './getAssetIconSVG'

const containerIconNames = ['rest', 'glas'] as const
const containerIconFolder = 'container'

describe('getAssetIconSVG', () => {
  it.each(containerIconNames)('returns correct icon path for assets', (name) => {
    const iconPath = getAssetIconSVG({ icon_name: name.toUpperCase() } as Feature['properties'], {
      iconEntry: 'icon_name',
      iconFolder: containerIconFolder,
    })

    expect(iconPath).toBe(`/container/${name}.svg`)
  })

  it('falls back to /asset-fallback.svg when iconFolder is missing', () => {
    const iconPath = getAssetIconSVG({ icon_name: 'rest' } as Feature['properties'], {
      iconEntry: 'icon_name',
    })

    expect(iconPath).toBe('/asset-fallback.svg')
  })

  it('falls back to /asset-fallback.svg when iconEntry is missing or property is absent', () => {
    const iconPathWithoutEntry = getAssetIconSVG({ icon_name: 'rest' } as Feature['properties'], {
      iconFolder: containerIconFolder,
    })

    expect(iconPathWithoutEntry).toBe('/asset-fallback.svg')

    const iconPathWithoutProperties = getAssetIconSVG(null, {
      iconEntry: 'icon_name',
      iconFolder: containerIconFolder,
    })

    expect(iconPathWithoutProperties).toBe('/asset-fallback.svg')
  })
})
