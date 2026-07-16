import { render, screen } from '@testing-library/react'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { NotesOverview } from './NotesOverview'

const defaultProps = {
  currentUserId: 1,
  meldingId: 123,
  notes: [],
  publicId: 'B100AA',
}

describe('NotesOverview', () => {
  it('renders the component', () => {
    render(<NotesOverview {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })
    const title = screen.getByRole('heading', { level: 1, name: 'title' })

    expect(link).toBeInTheDocument()
    expect(title).toBeInTheDocument()
  })

  it('renders a list of notes', () => {
    const notes = [
      {
        created_at: '2024-03-05T14:07:00Z',
        id: 1,
        text: 'This is a test note.',
        user: { email: 'test@example.com' },
      },
      {
        created_at: '2024-04-05T14:07:00Z',
        id: 2,
        text: 'This is another test note.',
        user: { email: 'test@example.com' },
      },
    ] as NoteRetrieveOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByText('This is a test note.')).toBeInTheDocument()
    expect(screen.getByText('This is another test note.')).toBeInTheDocument()
    expect(screen.getAllByText('test@example.com')).toHaveLength(2)
  })
})
