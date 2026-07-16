import { render, screen } from '@testing-library/react'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { formatDateTime, Note } from './Note'

describe('formatDateTime', () => {
  it('formats a date string correctly', () => {
    expect(formatDateTime('2024-03-05T08:09:00Z')).toBe('05-03-2024 09:09')
  })
})

const mockNote = {
  created_at: '2024-03-05T08:09:00Z',
  id: 1,
  text: 'This is a test note.',
  updated_at: '2024-03-05T08:09:00Z',
  user: {
    email: 'test@example.com',
  },
} as NoteRetrieveOutput

describe('Note', () => {
  it('renders the note text and user email', () => {
    render(<Note currentUserId={1} meldingId={123} note={mockNote} />)

    expect(screen.getByText('This is a test note.')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('05-03-2024 09:09')).toBeInTheDocument()
  })

  it('does not show an edit link for a note that does not belong to the current user', () => {
    const someonesNote = {
      ...mockNote,
      user: { email: 'test@example.com', id: 2 },
    } as NoteRetrieveOutput

    render(<Note currentUserId={1} meldingId={123} note={someonesNote} />)

    const editLink = screen.queryByRole('link', { name: 'edit-link' })

    expect(editLink).not.toBeInTheDocument()
  })

  it('shows an edit link for notes that belong to the current user', () => {
    const myNote = {
      ...mockNote,
      user: { email: 'test@example.com', id: 1 },
    } as NoteRetrieveOutput

    render(<Note currentUserId={1} meldingId={123} note={myNote} />)

    const editLink = screen.getByRole('link', { name: 'edit-link' })

    expect(editLink).toBeInTheDocument()
  })

  it('shows a deleted note message when the note text is empty', () => {
    const emptyNote = { ...mockNote, text: '' }

    render(<Note currentUserId={1} meldingId={123} note={emptyNote} />)

    expect(screen.getByText('deleted-note')).toBeInTheDocument()
  })

  it('lets a user know when a note was edited', () => {
    const editedNote = {
      ...mockNote,
      updated_at: '2024-03-05T09:09:00Z',
    } as NoteRetrieveOutput

    render(<Note currentUserId={1} meldingId={123} note={editedNote} />)

    const visualOnlyEditedText = screen.getByText('edited', { exact: true, selector: 'span' })
    const visuallyHiddenEditedText = screen.getByText('visually-hidden-texts.edited')

    expect(visualOnlyEditedText).toBeInTheDocument()
    expect(visuallyHiddenEditedText).toBeInTheDocument()
  })
})
