import { render, screen } from '@testing-library/react'

import { Page } from './Page'

describe('Page', () => {
  it('renders the back link, title and children', () => {
    render(
      <Page meldingId={123}>
        <p>Child content</p>
      </Page>,
    )

    expect(screen.getByRole('link', { name: 'back-link' })).toHaveAttribute('href', '/melding/123')
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })
})
