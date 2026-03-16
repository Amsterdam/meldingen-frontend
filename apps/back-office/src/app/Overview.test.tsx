import { render, screen } from '@testing-library/react'

import { melding } from '../mocks/data'
import { getMeldingDetailHref } from './_components/utils/overviewFields'
import { Overview } from './Overview'

import styles from './Overview.module.css'

describe('Overview', () => {
  it('should render correctly', () => {
    const { container } = render(<Overview meldingen={[melding]} meldingenCount={10} totalPages={1} />)

    expect(screen.getByRole('heading', { level: 1, name: 'overview.title' })).toBeInTheDocument()

    const idHeader = screen.getByRole('columnheader', { name: 'overview.column-header.public_id' })
    const detailLinks = screen.getAllByRole('link', { name: 'ABC' })

    // Mobile and desktop views are both rendered and toggled via CSS.
    const publicIdLabels = screen.getAllByText('overview.column-header.public_id')

    const mobileOverview = container.querySelector(`.${styles.mobileOnly}`)
    const desktopOverview = container.querySelector(`.${styles.desktopOnly}`)

    expect(idHeader).toBeInTheDocument()
    expect(detailLinks[0]).toHaveAttribute('href', getMeldingDetailHref(melding))
    expect(publicIdLabels.length).toBeGreaterThan(0)

    expect(mobileOverview).toBeInTheDocument()
    expect(desktopOverview).toBeInTheDocument()
  })
})
