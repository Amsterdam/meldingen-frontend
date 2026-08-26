import { getAssetSubType } from './getAssetSubType'

describe('getAssetSubType', () => {
  it('returns undefined when properties is null', () => {
    expect(getAssetSubType(null)).toBeUndefined()
  })

  it('returns objecttype_omschrijving when it exists', () => {
    expect(getAssetSubType({ objecttype_omschrijving: 'Afvalbak' })).toBe('Afvalbak')
  })

  it('returns fractie_omschrijving when objecttype_omschrijving is missing', () => {
    expect(getAssetSubType({ fractie_omschrijving: 'Glas' })).toBe('Glas')
  })

  it('skips falsy values and returns the next matching property', () => {
    expect(
      getAssetSubType({
        fractie_omschrijving: 'Restafval',
        objecttype_omschrijving: '',
      }),
    ).toBe('Restafval')
  })

  it('returns undefined when no supported subtype properties exist', () => {
    expect(getAssetSubType({ name: 'Asset without subtype' })).toBeUndefined()
  })
})
