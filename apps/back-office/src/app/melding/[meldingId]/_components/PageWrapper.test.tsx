import { render, screen } from '@testing-library/react'

import { PageWrapper } from './PageWrapper'

describe('PageWrapper', () => {
  it('renders the backLink and children inside the main landmark', () => {
    render(
      <PageWrapper backLink={{ href: '/melding/123', label: 'Back to report' }}>
        <p>Page content</p>
      </PageWrapper>,
    )

    expect(screen.getByRole('link', { name: 'Back to report' })).toHaveAttribute('href', '/melding/123')
    expect(screen.getByRole('main')).toContainElement(screen.getByText('Page content'))
  })

  it('sets the document title when provided', () => {
    render(
      <PageWrapper backLink={{ href: '/melding/123', label: 'Back to report' }} documentTitle="Report details">
        <p>Page content</p>
      </PageWrapper>,
    )

    expect(document.title).toBe('Report details')
  })

  it('does not change the document title when no title is provided', () => {
    document.title = 'Existing title'

    render(
      <PageWrapper backLink={{ href: '/melding/123', label: 'Back to report' }}>
        <p>Page content</p>
      </PageWrapper>,
    )

    expect(document.title).toBe('Existing title')
  })
})
