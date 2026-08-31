import { describe, expect, it } from 'vitest'

import { getAssetSubType } from './getAssetSubType'

describe('getAssetSubType', () => {
  it('returns undefined when the subtype key is missing', () => {
    expect(getAssetSubType(undefined, { objecttype_omschrijving: 'Afvalbak' })).toBeUndefined()
  })

  it('returns undefined when properties is null', () => {
    expect(getAssetSubType('objecttype_omschrijving', null)).toBeUndefined()
  })

  it('returns the property value for the provided subtype key', () => {
    expect(getAssetSubType('objecttype_omschrijving', { objecttype_omschrijving: 'Afvalbak' })).toBe('Afvalbak')
  })

  it('returns undefined when the provided subtype key is not present', () => {
    expect(getAssetSubType('objecttype_omschrijving', { fractie_omschrijving: 'Glas' })).toBeUndefined()
  })

  it('returns undefined when the subtype property value is an empty string', () => {
    expect(getAssetSubType('objecttype_omschrijving', { objecttype_omschrijving: '' })).toBeUndefined()
  })
})
