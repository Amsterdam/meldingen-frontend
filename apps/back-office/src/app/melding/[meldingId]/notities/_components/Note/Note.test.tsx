import { render, screen } from '@testing-library/react'

import type { ClassificationOutput, NoteOutput } from '@meldingen/api-client'

import { Note } from './Note'

const mockNote = {
  created_at: '2024-03-05T08:09:00Z',
  id: 1,
  text: 'This is a test note.',
  updated_at: '2024-03-05T08:09:00Z',
  user: {
    email: 'test@example.com',
  },
} as NoteOutput

const mockClassification = {
  created_at: '2024-01-01T00:00:00Z',
  id: 2,
  name: 'Category 2',
  updated_at: '2024-01-01T00:00:00Z',
} as ClassificationOutput

describe('Note', () => {
  it('renders the note', () => {
    render(<Note note={mockNote} />)

    expect(screen.getByText('This is a test note.')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('05-03-2024 09:09')).toBeInTheDocument()
  })

  it('renders the given link', () => {
    render(<Note link={{ href: '/some-link', label: 'Some link' }} note={mockNote} />)

    expect(screen.getByRole('link', { name: 'Some link' })).toHaveAttribute('href', '/some-link')
  })

  it('does not render a link when none is given', () => {
    render(<Note note={mockNote} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('shows a deleted note message when the note text is empty', () => {
    const emptyNote = { ...mockNote, text: '' }

    render(<Note note={emptyNote} />)

    expect(screen.getByText('deleted-note')).toBeInTheDocument()
  })

  it('lets a user know when a note was edited', () => {
    const editedNote = {
      ...mockNote,
      updated_at: '2024-03-05T09:09:00Z',
    } as NoteOutput

    render(<Note note={editedNote} />)

    const visualOnlyEditedText = screen.getByText('edited', { exact: true, selector: 'span' })
    const visuallyHiddenEditedText = screen.getByText('visually-hidden-texts.edited')

    expect(visualOnlyEditedText).toBeInTheDocument()
    expect(visuallyHiddenEditedText).toBeInTheDocument()
  })

  it('shows the note classification when available', () => {
    render(<Note classification={mockClassification} note={mockNote} />)

    expect(screen.getByText('classification')).toBeInTheDocument()
    expect(screen.getByText('Category 2')).toBeInTheDocument()
  })
})
