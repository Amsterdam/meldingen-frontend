import { melding } from '../../../mocks/data'
import { formatValue, getMeldingDetailHref, OVERVIEW_FIELDS, OverviewField } from './overviewFields'

describe('overviewFields utils', () => {
  const t = (key: string) => key

  describe('OVERVIEW_FIELDS', () => {
    it('contains the expected field definitions in order', () => {
      expect(OVERVIEW_FIELDS).toEqual([
        { key: 'public_id', labelKey: 'column-header.public_id' },
        { key: 'created_at', labelKey: 'column-header.created_at' },
        { key: 'classification', labelKey: 'column-header.classification' },
        { key: 'state', labelKey: 'column-header.state' },
        { key: 'address', labelKey: 'column-header.address' },
        { key: 'postal_code', labelKey: 'column-header.postal_code' },
      ])
    })
  })

  describe('getMeldingDetailHref', () => {
    it('builds the detail url using id and public_id', () => {
      expect(getMeldingDetailHref(melding)).toBe(`/melding/${melding.id}?id=${melding.public_id}`)
    })
  })

  describe('formatValue', () => {
    it('returns an address if present', () => {
      const meldingWithAddress = {
        ...melding,
        address: 'Amstel 1',
      }

      const result = formatValue(meldingWithAddress, 'address', t)
      expect(result).toBe(meldingWithAddress.address)
    })

    it('returns an empty string if address is missing', () => {
      const result = formatValue(melding, 'address', t)

      expect(result).toBe('')
    })

    it('returns the classification name if present', () => {
      const result = formatValue(melding, 'classification', t)

      expect(result).toBe(melding?.classification?.name)
    })

    it('returns a fallback label if classification is missing', () => {
      const meldingWithoutClassification = { ...melding, classification: undefined }
      const result = formatValue(meldingWithoutClassification, 'classification', t)

      expect(result).toBe('overview.no-classification')
    })

    it('returns a formatted date for created_at', () => {
      const result = formatValue(melding, 'created_at', t)

      expect(result).toBe(new Date(melding.created_at).toLocaleDateString('nl-NL'))
    })

    it('returns a postal code if present', () => {
      const result = formatValue(melding, 'postal_code', t)

      expect(result).toBe(melding.postal_code)
    })

    it('returns empty string if postal code is missing', () => {
      const meldingWithoutPostalCode = { ...melding, postal_code: undefined }
      const result = formatValue(meldingWithoutPostalCode, 'postal_code', t)

      expect(result).toBe('')
    })

    it('returns the public id for public_id', () => {
      const result = formatValue(melding, 'public_id', t)

      expect(result).toBe(melding.public_id)
    })

    it('returns the translated state key for state', () => {
      const result = formatValue(melding, 'state', t)

      expect(result).toBe(`shared.state.${melding.state}`)
    })

    it('returns undefined for unknown keys', () => {
      const result = formatValue(melding, 'unknown_key' as OverviewField['key'], t)

      expect(result).toBeUndefined()
    })
  })
})
