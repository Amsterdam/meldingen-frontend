import { melding } from '../../../mocks/data'
import { formatValue, getMeldingDetailHref, OverviewField } from './overviewFields'

describe('overviewFields utils', () => {
  const t = (key: string) => key

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

    it('returns an empty string for unknown keys', () => {
      const result = formatValue(melding, 'unknown_key' as OverviewField['key'], t)

      expect(result).toBe('')
    })
  })
})
