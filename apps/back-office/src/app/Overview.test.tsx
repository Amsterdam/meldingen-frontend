import { render, screen } from '@testing-library/react'

import { formatValue, LinkComponent, Overview } from './Overview'
import { melding } from '../mocks/data'

describe('Overview', () => {
  it('should render correctly', () => {
    render(<Overview meldingen={[melding]} meldingenCount={10} totalPages={1} />)

    const idHeader = screen.getByRole('columnheader', { name: 'overview.column-header.public_id' })
    const firstId = screen.getByRole('cell', { name: 'ABC' })

    expect(idHeader).toBeInTheDocument()
    expect(firstId).toBeInTheDocument()
  })
})

describe('formatValue', () => {
  const t = (key: string) => key

  it('returns a formatted date for created_at', () => {
    const result = formatValue(melding, 'created_at', t)

    expect(result).toBe(new Date(melding.created_at).toLocaleDateString('nl-NL'))
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

  it('returns the melding state', () => {
    const result = formatValue(melding, 'state', t)

    expect(result).toBe('generic.melding-state.questions_answered')
  })

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

  it('returns a postal code if present', () => {
    const result = formatValue(melding, 'postal_code', t)

    expect(result).toBe(melding.postal_code)
  })

  it('returns empty string if postal code is missing', () => {
    const meldingWithoutPostalCode = { ...melding, postal_code: undefined }
    const result = formatValue(meldingWithoutPostalCode, 'postal_code', t)

    expect(result).toBe('')
  })

  it('returns undefined for unknown key', () => {
    const result = formatValue(melding, 'unknown_key', t)

    expect(result).toBeUndefined()
  })
})

describe('LinkComponent', () => {
  it('renders a link with the given href', () => {
    const { container } = render(<LinkComponent href="/test-url">Test Link</LinkComponent>)
    const link = container.querySelector('a')

    expect(link).toBeInTheDocument()
    expect(link?.getAttribute('href')).toBe('/test-url')
  })

  it('renders a link with an empty href if none is provided', () => {
    const { container } = render(<LinkComponent>Test Link</LinkComponent>)
    const link = container.querySelector('a')

    expect(link).toBeInTheDocument()
    expect(link?.getAttribute('href')).toBe('')
  })

  it('passes additional props to the link', () => {
    const { container } = render(
      <LinkComponent href="/foo" target="_blank" rel="noopener noreferrer">
        Test Link
      </LinkComponent>,
    )

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
