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

  it('updates the document title when it changes and another title already exists in the head', () => {
    const metadataTitle = document.createElement('title')

    metadataTitle.textContent = 'Metadata title'
    document.head.appendChild(metadataTitle)

    const { rerender } = render(
      <PageWrapper backLink={{ href: '/melding/123', label: 'Back to report' }} documentTitle="Report details">
        <p>Page content</p>
      </PageWrapper>,
    )

    // Simulate the metadata title being hoisted after the PageWrapper title, making it the first title in the head
    document.head.insertBefore(metadataTitle, document.head.querySelector('title'))

    rerender(
      <PageWrapper backLink={{ href: '/melding/123', label: 'Back to report' }} documentTitle="Error - Report details">
        <p>Page content</p>
      </PageWrapper>,
    )

    expect(document.title).toBe('Error - Report details')

    metadataTitle.remove()
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
