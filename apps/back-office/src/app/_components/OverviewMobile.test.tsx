import { render, screen } from '@testing-library/react'

import { OverviewMobile } from './OverviewMobile'
import { getMeldingDetailHref, OVERVIEW_FIELDS } from './utils/overviewFields'
import { melding } from '~/mocks/data'

describe('OverviewMobile', () => {
  it('renders labels, values, and a detail link for each melding', () => {
    const meldingWithAddress = { ...melding, address: 'Amstel 1' }
    const createdAt = new Date(meldingWithAddress.created_at).toLocaleDateString('nl-NL')
    const classificationText = meldingWithAddress.classification!.name
    const postalCode = meldingWithAddress.postal_code

    render(<OverviewMobile meldingen={[meldingWithAddress]} />)

    OVERVIEW_FIELDS.forEach((field) => {
      expect(screen.getByText(`overview.${field.labelKey}`)).toBeInTheDocument()
    })

    const detailLink = screen.getByRole('link', { name: meldingWithAddress.public_id })
    expect(detailLink).toHaveAttribute('href', getMeldingDetailHref(meldingWithAddress))

    expect(screen.getByText(createdAt)).toBeInTheDocument()
    expect(screen.getByText(classificationText)).toBeInTheDocument()
    expect(screen.getByText(`shared.state.${meldingWithAddress.state}`)).toBeInTheDocument()
    expect(screen.getByText('Amstel 1')).toBeInTheDocument()
    expect(screen.getByText(postalCode!)).toBeInTheDocument()
  })
})
