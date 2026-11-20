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
  it('renders an empty, required rich text editor', async () => {
    render(<AddNote {...defaultProps} />)

    const editor = await screen.findByRole('textbox', { name: 'label' })

    expect(editor).toHaveTextContent('')
    expect(editor).toHaveAttribute('aria-required', 'true')
  })

  it('restores the submitted addNote value after validation errors', async () => {
    const formData = new FormData()

    formData.append('addNote', 'Some note text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'addNote', message: 'Error message' }] },
      vi.fn(),
      false,
    ])

    render(<AddNote {...defaultProps} />)

    expect(await screen.findByRole('textbox', { name: 'label' })).toHaveTextContent('Some note text')
  })
})
