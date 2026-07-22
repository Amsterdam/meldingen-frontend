import type { Feature } from '@meldingen/api-client'

import { getAssetIcon } from './getAssetIcon'

import styles from './getAssetIcon.module.css'

const makeFeature = (properties?: Feature['properties']): Feature =>
  ({
    geometry: {
      coordinates: [0, 0],
      type: 'Point',
    },
    properties,
    type: 'Feature',
  }) as Feature

const containerIconNames = ['rest', 'glas'] as const
const containerIconFolder = 'container'

describe('getAssetIcon', () => {
  it.each(containerIconNames)('returns correct iconUrl for assets (unselected)', (name) => {
    const feature = makeFeature({ icon_name: name.toUpperCase() } as Feature['properties'])

    const icon = getAssetIcon(feature, false, {
      entry: 'icon_name',
      folder: containerIconFolder,
    })

    expect(icon.options.iconUrl).toBe(`/container/${name}.svg`)
  })

  it.each(containerIconNames)('returns correct iconUrl for assets (selected)', (name) => {
    const feature = makeFeature({ icon_name: name.toUpperCase() } as Feature['properties'])

    const icon = getAssetIcon(feature, true, {
      entry: 'icon_name',
      folder: containerIconFolder,
    })

    expect(icon.options.iconUrl).toBe(`/container/${name}.svg`)
    expect(icon.options.className).toBe(styles.border)
  })

  it('falls back to /asset-fallback.svg when folder is missing', () => {
    const feature = makeFeature({ icon_name: 'rest' } as Feature['properties'])
    const icon = getAssetIcon(feature, false, { entry: 'icon_name' })

    expect(icon.options.iconUrl).toBe('/asset-fallback.svg')
  })

  it('falls back to /asset-fallback.svg when entry is missing or property is absent', () => {
    const featureWithoutEntry = makeFeature({ icon_name: 'rest' } as Feature['properties'])
    const iconWithoutEntry = getAssetIcon(featureWithoutEntry, false, {
      folder: containerIconFolder,
    })

    expect(iconWithoutEntry.options.iconUrl).toBe('/asset-fallback.svg')

    const featureWithoutProperties = makeFeature(undefined)
    const iconWithoutProperties = getAssetIcon(featureWithoutProperties, false, {
      entry: 'icon_name',
      folder: containerIconFolder,
    })

    expect(iconWithoutProperties.options.iconUrl).toBe('/asset-fallback.svg')
  })
})
