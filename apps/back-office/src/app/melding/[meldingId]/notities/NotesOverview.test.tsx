import { render, screen, within } from '@testing-library/react'

import type { ClassificationOutput, NoteOutput } from '@meldingen/api-client'

import { NotesOverview } from './NotesOverview'

const defaultProps = {
  classifications: undefined,
  currentUserId: 1,
  meldingId: 123,
  notes: [],
  overviewHref: '/',
  publicId: 'B100AA',
}

const classifications = [
  {
    created_at: '2024-01-01T00:00:00Z',
    id: 1,
    name: 'Test classification',
    updated_at: '2024-01-01T00:00:00Z',
  },
] as ClassificationOutput[]

describe('NotesOverview', () => {
  it('renders the component', () => {
    render(<NotesOverview {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })
    const title = screen.getByRole('heading', { level: 1, name: 'title' })

    expect(link).toBeInTheDocument()
    expect(title).toBeInTheDocument()
  })

  it('links back to the given overview page', () => {
    render(<NotesOverview {...defaultProps} overviewHref="/?pagina=4" />)

    expect(screen.getByRole('link', { name: 'back-link' })).toHaveAttribute('href', '/?pagina=4')
  })

  it('renders a list of notes', () => {
    const notes = [
      {
        classification_id: 1,
        created_at: '2024-03-05T14:07:00Z',
        id: 1,
        text: 'This is a test note.',
        user: { email: 'test@example.com' },
      },
      {
        classification_id: null,
        created_at: '2024-04-05T14:07:00Z',
        id: 2,
        text: 'This is another test note.',
        user: { email: 'test@example.com' },
      },
    ] as NoteOutput[]

    render(<NotesOverview {...defaultProps} classifications={classifications} notes={notes} />)

    expect(screen.getByText('This is a test note.')).toBeInTheDocument()
    expect(screen.getByText('This is another test note.')).toBeInTheDocument()
    expect(screen.getAllByText('test@example.com')).toHaveLength(2)
    expect(screen.getByText('Test classification')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tab-navigation\.notes\s*\(2\)/ })).toBeInTheDocument()
    const notesRegion = screen.getByRole('region', { name: 'list-label' })

    expect(within(notesRegion).getByRole('list')).toBeInTheDocument()
  })

  it('shows an edit link for notes that belong to the current user', () => {
    const notes = [
      { created_at: '2024-03-05T14:07:00Z', id: 1, text: 'My note.', user: { email: 'test@example.com', id: 1 } },
    ] as NoteOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByRole('link', { name: 'edit-link' })).toHaveAttribute('href', '/melding/123/notities/1/wijzigen')
    expect(screen.queryByRole('link', { name: 'reply-link' })).not.toBeInTheDocument()
  })

  it('shows a reply link for notes that do not belong to the current user', () => {
    const notes = [
      { created_at: '2024-03-05T14:07:00Z', id: 1, text: 'Their note.', user: { email: 'test@example.com', id: 2 } },
    ] as NoteOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByRole('link', { name: 'reply-link' })).toHaveAttribute('href', '/melding/123/notities/1/reageren')
    expect(screen.queryByRole('link', { name: 'edit-link' })).not.toBeInTheDocument()
  })

  it('shows no reply link for deleted notes that do not belong to the current user', () => {
    const notes = [
      { created_at: '2024-03-05T14:07:00Z', id: 1, text: '', user: { email: 'test@example.com', id: 2 } },
    ] as NoteOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByText('deleted-note')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'reply-link' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'edit-link' })).not.toBeInTheDocument()
  })

  it('still shows an edit link for deleted notes that belong to the current user', () => {
    const notes = [
      { created_at: '2024-03-05T14:07:00Z', id: 1, text: '', user: { email: 'test@example.com', id: 1 } },
    ] as NoteOutput[]

    render(<NotesOverview {...defaultProps} notes={notes} />)

    expect(screen.getByRole('link', { name: 'edit-link' })).toHaveAttribute('href', '/melding/123/notities/1/wijzigen')
  })
})
