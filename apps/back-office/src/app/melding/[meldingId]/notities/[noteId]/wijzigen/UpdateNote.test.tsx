import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'

import type { NoteOutput } from '@meldingen/api-client'

import { UpdateNote } from './UpdateNote'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps = {
  meldingId: 123,
  note: {
    id: 456,
    text: 'This is a note.',
  } as NoteOutput,
}

describe('UpdateNote', () => {
  it('renders the note text in an optional rich text editor', async () => {
    render(<UpdateNote {...defaultProps} />)

    const editor = await screen.findByRole('textbox', { name: 'label' })

    expect(editor).toHaveTextContent('This is a note.')
    expect(editor).toHaveAttribute('aria-required', 'false')
  })

  it('restores the submitted updateNote value after validation errors', async () => {
    const formData = new FormData()

    formData.append('updateNote', 'Some note text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'updateNote', message: 'Error message' }] },
      vi.fn(),
      false,
    ])

    render(<UpdateNote {...defaultProps} />)

    expect(await screen.findByRole('textbox', { name: 'label' })).toHaveTextContent('Some note text')
  })
})
