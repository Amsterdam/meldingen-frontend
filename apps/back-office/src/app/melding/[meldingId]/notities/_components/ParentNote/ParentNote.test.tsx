import { render, screen } from '@testing-library/react'

import { ParentNote } from './ParentNote'

const parentNote = {
  createdAt: '2026-03-23T10:12:00Z',
  email: 'parent@example.com',
  text: 'Container is nu leeg.',
}

describe('ParentNote', () => {
  it('renders the parent note as a figure with a caption and a quote', () => {
    const { container } = render(<ParentNote parentNote={parentNote} />)

    const figure = screen.getByRole('figure')

    // jsdom does not derive a figure's accessible name from its figcaption, so check the structure.
    expect(container.querySelector('figure > figcaption')).toHaveTextContent('intro')
    expect(figure).toContainElement(screen.getByRole('blockquote'))
    expect(screen.getByRole('blockquote')).toHaveTextContent('Container is nu leeg.')
  })

  it('shows the email and created date of the parent note', () => {
    render(<ParentNote parentNote={parentNote} />)

    expect(screen.getByText('parent@example.com')).toBeInTheDocument()
    expect(screen.getByText('23-03-2026 11:12')).toHaveAttribute('dateTime', '2026-03-23T10:12:00Z')
  })

  it('hides the visual email and date lines from screen readers, in favour of the intro text', () => {
    render(<ParentNote parentNote={parentNote} />)

    expect(screen.getByText('parent@example.com')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('23-03-2026 11:12')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('intro')).toHaveClass('ams-visually-hidden')
  })

  it('only renders the snapshot when the author of the parent note is unknown', () => {
    const { container } = render(<ParentNote parentNote={{ text: 'Container is nu leeg.' }} />)

    expect(screen.getByText('intro-without-author')).toHaveClass('ams-visually-hidden')
    expect(screen.getByRole('blockquote')).toHaveTextContent('Container is nu leeg.')
    expect(screen.queryByText('intro')).not.toBeInTheDocument()
    expect(container.querySelector('time')).not.toBeInTheDocument()
  })
})
