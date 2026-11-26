import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { NoteOutput } from '@meldingen/api-client'

import { NoteForm } from './NoteForm'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps = {
  action: vi.fn(),
  fieldName: 'note',
  meldingId: 123,
  translationNamespace: 'add-note' as const,
}

describe('NoteForm', () => {
  beforeEach(() => {
    document.title = 'Notitie - Gemeente Amsterdam'
  })

  it('preserves the server-rendered document title when there are no errors', () => {
    render(<NoteForm {...defaultProps} />)

    expect(document.title).toBe('Notitie - Gemeente Amsterdam')
  })

  it('renders the back link', () => {
    render(<NoteForm {...defaultProps} />)

    expect(screen.getByRole('link', { name: 'back-link' })).toHaveAttribute('href', '/melding/123')
  })

  it('renders the title', () => {
    render(<NoteForm {...defaultProps} />)

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
  })

  it('renders the parent note between the title and the form', async () => {
    const parentNote = {
      created_at: '2024-03-05T08:09:00Z',
      id: 1,
      text: 'Parent note content',
      updated_at: '2024-03-05T08:09:00Z',
      user: { email: 'parent@example.com' },
    } as NoteOutput

    render(<NoteForm {...defaultProps} parentNote={parentNote} />)

    const heading = screen.getByRole('heading', { level: 1, name: 'title' })
    const note = screen.getByText('Parent note content')
    const editor = await screen.findByRole('textbox', { name: 'label' })

    expect(heading.compareDocumentPosition(note)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(note.compareDocumentPosition(editor)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders the rich text editor', async () => {
    render(<NoteForm {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: 'label' })).toBeInTheDocument()
  })

  it.each([
    { expected: 'true', required: true },
    { expected: 'false', required: undefined },
  ])('sets aria-required to $expected when required is $required', async ({ expected, required }) => {
    render(<NoteForm {...defaultProps} required={required} />)

    expect(await screen.findByRole('textbox', { name: 'label' })).toHaveAttribute('aria-required', expected)
  })

  it('renders the cancel link', () => {
    render(<NoteForm {...defaultProps} />)

    expect(screen.getByRole('link', { name: 'cancel-link' })).toHaveAttribute('href', '/melding/123')
  })

  it('renders the default value in the rich text editor', async () => {
    render(<NoteForm {...defaultProps} defaultValue="This is a note." />)

    expect(await screen.findByRole('textbox', { name: 'label' })).toHaveTextContent('This is a note.')
  })

  it('displays an API error alert with the correct document title when there is an API error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: { detail: 'Something went wrong' } }, vi.fn(), false])

    const { container } = render(<NoteForm {...defaultProps} />)

    expect(container.querySelector('.ams-alert')).toBeInTheDocument()
    expect(document.title).toBe('api-error-alert.heading - Notitie - Gemeente Amsterdam')
  })

  it('displays an invalid form alert and restores the submitted value when there are validation errors', async () => {
    const formData = new FormData()

    formData.append('note', 'Submitted text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'note', message: 'Error message' }] },
      vi.fn(),
      false,
    ])

    render(<NoteForm {...defaultProps} defaultValue="Default text" />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Error message' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'label' })).toHaveTextContent('Submitted text')
    expect(document.title).toBe('document-title-error-count-prefix Notitie - Gemeente Amsterdam')
  })

  it.each([
    { apiError: { detail: 'Error message' } },
    { validationErrors: [{ key: 'note', message: 'Error message' }] },
  ])('restores the server-rendered document title when errors are resolved: %j', (state) => {
    vi.mocked(useActionState).mockReturnValueOnce([state, vi.fn(), false])

    const { rerender } = render(<NoteForm {...defaultProps} />)

    expect(document.title).not.toBe('Notitie - Gemeente Amsterdam')

    rerender(<NoteForm {...defaultProps} />)

    expect(document.title).toBe('Notitie - Gemeente Amsterdam')
  })

  it('restores the server-rendered document title when leaving the page after an API error', () => {
    vi.mocked(useActionState).mockReturnValueOnce([{ apiError: { detail: 'Error message' } }, vi.fn(), false])

    const { unmount } = render(<NoteForm {...defaultProps} />)

    expect(document.title).toBe('api-error-alert.heading - Notitie - Gemeente Amsterdam')

    unmount()

    expect(document.title).toBe('Notitie - Gemeente Amsterdam')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()
    const mockFormAction = vi.fn()

    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction, false])

    render(<NoteForm {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    expect(mockFormAction).toHaveBeenCalled()
  })
})
