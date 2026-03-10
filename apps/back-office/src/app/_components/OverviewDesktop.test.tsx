import { render, screen } from '@testing-library/react'

import { melding } from '../../mocks/data'
import { OverviewDesktop } from './OverviewDesktop'
import { getMeldingDetailHref, OVERVIEW_FIELDS } from './utils/overviewFields'

describe('OverviewDesktop', () => {
  const t = (key: string) => key

  it('renders column headers and values for the default fields', () => {
    const meldingWithAddress = { ...melding, address: 'Amstel 1' }
    const postalCode = meldingWithAddress.postal_code ?? ''

    render(<OverviewDesktop meldingen={[meldingWithAddress]} t={t} />)

    OVERVIEW_FIELDS.forEach((field) => {
      expect(screen.getByRole('columnheader', { name: `overview.${field.labelKey}` })).toBeInTheDocument()
    })

    const detailLink = screen.getByRole('link', { name: melding.public_id })

    expect(detailLink).toHaveAttribute('href', getMeldingDetailHref(melding))

    expect(
      screen.getByRole('cell', { name: new Date(melding.created_at).toLocaleDateString('nl-NL') }),
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: melding.classification?.name })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: `shared.state.${melding.state}` })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Amstel 1' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: postalCode })).toBeInTheDocument()
  })

  it('renders only the provided fields when fields prop is set', () => {
    const meldingWithAddress = { ...melding, address: 'Amstel 1' }

    render(<OverviewDesktop fields={[OVERVIEW_FIELDS[0], OVERVIEW_FIELDS[3]]} meldingen={[meldingWithAddress]} t={t} />)

    expect(screen.getByRole('columnheader', { name: 'overview.column-header.public_id' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'overview.column-header.state' })).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'overview.column-header.created_at' })).not.toBeInTheDocument()
  })
})
