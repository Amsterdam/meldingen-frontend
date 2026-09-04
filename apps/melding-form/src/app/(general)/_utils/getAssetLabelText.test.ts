import type { Feature } from '@meldingen/api-client'

import { getAssetLabelText } from './getAssetLabelText'

const asset: Feature = {
  geometry: {
    coordinates: [4.9, 52.3],
    type: 'Point',
  },
  id: 'container.1',
  properties: {
    fractie_omschrijving: 'Papier',
    id_nummer: 12345,
    name: 'Example asset',
  },
  type: 'Feature',
}

describe('getAssetLabelText', () => {
  it('returns the asset id when no label template is provided', () => {
    expect(getAssetLabelText(asset)).toBe('container.1')
  })

  it('replaces placeholders in the label template with matching asset properties', () => {
    expect(getAssetLabelText(asset, '{{fractie_omschrijving}} container - {{id_nummer}}')).toBe(
      'Papier container - 12345',
    )
  })

  it('removes missing placeholder values and trims surrounding whitespace', () => {
    expect(getAssetLabelText(asset, ' {{name}} {{missing_field}} ')).toBe('Example asset')
  })

  it('falls back to the asset id when the rendered label is empty', () => {
    expect(getAssetLabelText(asset, '{{missing_field}}')).toBe('container.1')
  })
})
