import { render, screen } from '@testing-library/react'

import { renderOverviewFieldValue } from './renderOverviewFieldValue'
import { melding } from '~/mocks/data'

const t = (key: string) => key

describe('renderOverviewFieldValue', () => {
  it('renders a link with the public id for the public_id field', () => {
    const result = renderOverviewFieldValue(melding, { key: 'public_id', labelKey: 'column-header.public_id' }, t)

    render(<>{result}</>)

    const link = screen.getByRole('link', { name: melding.public_id })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/melding/${melding.id}?id=${melding.public_id}`)
  })

  it('returns a formatted value for non-public_id fields', () => {
    const result = renderOverviewFieldValue(melding, { key: 'state', labelKey: 'column-header.state' }, t)

    expect(result).toBe(`shared.state.${melding.state}`)
  })
})
