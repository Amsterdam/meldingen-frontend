import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'

import { AddNote } from './AddNote'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps = { meldingId: 123 }

describe('AddNote', () => {
  it('renders the note form', () => {
    render(<AddNote {...defaultProps} />)

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'back-link' })).toHaveAttribute('href', '/melding/123')
    expect(screen.getByRole('button', { name: 'submit-button' })).toBeInTheDocument()
  })

  it('renders an empty, required rich text editor', async () => {
    render(<AddNote {...defaultProps} />)

    const editor = await screen.findByRole('textbox', { name: 'label' })

    expect(editor).toHaveTextContent('')
    expect(editor).toHaveAttribute('aria-required', 'true')
  })

  it('shows validation errors for the addNote field', async () => {
    const formData = new FormData()

    formData.append('addNote', 'Some note text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'addNote', message: 'Error message' }] },
      vi.fn(),
      false,
    ])

    render(<AddNote {...defaultProps} />)

    expect(await screen.findByRole('textbox', { name: 'label' })).toHaveTextContent('Some note text')
    expect(screen.getByRole('link', { name: 'Error message' })).toBeInTheDocument()
  })
})
