import { render, screen } from '@testing-library/react'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { formatDateTime, NotesOverview } from './NotesOverview'

describe('formatDateTime', () => {
  it('formats a date string correctly', () => {
    expect(formatDateTime('2024-03-05T08:09:00Z')).toBe('05-03-2024 09:09')
  })
})

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

  it('renders notes when provided', () => {
    const notes = [
      { created_at: '2024-03-05T14:07:00Z', id: 1, text: 'This is a test note.', user: { email: 'test@example.com' } },
      {
        created_at: '2024-03-05T15:07:00Z',
        id: 2,
        text: 'This is another test note.',
        user: { email: 'another@example.com' },
      },
    ] as NoteRetrieveOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByText('This is a test note.')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('05-03-2024 15:07')).toBeInTheDocument()

    expect(screen.getByText('This is another test note.')).toBeInTheDocument()
    expect(screen.getByText('another@example.com')).toBeInTheDocument()
    expect(screen.getByText('05-03-2024 16:07')).toBeInTheDocument()
  })

  it('does not show an edit link for notes that do not belong to the current user', () => {
    const notes = [
      {
        created_at: '2024-03-05T14:07:00Z',
        id: 1,
        text: 'This is a test note.',
        user: { email: 'test@example.com', id: 2 },
      },
    ] as NoteRetrieveOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    const editLink = screen.queryByRole('link', { name: 'edit-link' })

    expect(editLink).not.toBeInTheDocument()
  })

  it('shows an edit link for notes that belong to the current user', () => {
    const notes = [
      {
        created_at: '2024-03-05T14:07:00Z',
        id: 1,
        text: 'This is a test note.',
        user: { email: 'test@example.com', id: 1 },
      },
    ] as NoteRetrieveOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    const editLink = screen.getByRole('link', { name: 'edit-link' })

    expect(editLink).toBeInTheDocument()
  })

  it('shows a deleted note message when the note text is empty', () => {
    const notes = [
      { created_at: '2024-03-05T14:07:00Z', id: 1, text: '', user: { email: 'test@example.com' } },
    ] as NoteRetrieveOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByText('deleted-note')).toBeInTheDocument()
  })
})
