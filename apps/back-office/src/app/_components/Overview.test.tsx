import { render, screen, within } from '@testing-library/react'

import { melding } from '../../mocks/data'
import { LinkComponent, Overview } from '../Overview'

import styles from '../Overview.module.css'

describe('Overview', () => {
  it('should render correctly', () => {
    const { container } = render(<Overview meldingen={[melding]} meldingenCount={10} totalPages={1} />)

    const idHeader = screen.getByRole('columnheader', { name: 'overview.column-header.public_id' })
    const firstId = screen.getByRole('cell', { name: 'ABC' })

    // Mobile and desktop views are both rendered and toggled via CSS.
    const publicIdLabels = screen.getAllByText('overview.column-header.public_id')

    const mobileOverview = container.querySelector(`.${styles.mobileOnly}`)
    const desktopOverview = container.querySelector(`.${styles.desktopOnly}`)

    expect(idHeader).toBeInTheDocument()
    expect(firstId).toBeInTheDocument()
    expect(publicIdLabels.length).toBeGreaterThan(0)

    expect(mobileOverview).toBeInTheDocument()
    expect(desktopOverview).toBeInTheDocument()

    expect(mobileOverview).toHaveClass(styles.mobileOnly)
    expect(desktopOverview).toHaveClass(styles.desktopOnly)

    expect(within(mobileOverview as HTMLElement).getByText('overview.column-header.public_id')).toBeInTheDocument()
    expect(
      within(desktopOverview as HTMLElement).getByRole('columnheader', { name: 'overview.column-header.public_id' }),
    ).toBeInTheDocument()
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
      <LinkComponent href="/foo" rel="noopener noreferrer" target="_blank">
        Test Link
      </LinkComponent>,
    )

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
