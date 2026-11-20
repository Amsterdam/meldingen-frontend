import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'

import type { NoteOutput } from '@meldingen/api-client'

import { ReactNote } from './ReactNote'

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
    created_at: '2025-05-26T11:56:34.081Z',
    id: 456,
    text: 'This is the original note.',
    updated_at: '2025-05-26T11:56:34.081Z',
    user: { email: 'colleague@example.com', id: 2 },
  } as NoteOutput,
}

describe('ReactNote', () => {
  it('renders the note that is being replied to', () => {
    render(<ReactNote {...defaultProps} />)

    expect(screen.getByText('This is the original note.')).toBeInTheDocument()
    expect(screen.getByText('colleague@example.com')).toBeInTheDocument()
  })

  it('renders an empty, required rich text editor', async () => {
    render(<ReactNote {...defaultProps} />)

    const editor = await screen.findByRole('textbox', { name: 'label' })

    expect(editor).not.toHaveTextContent('This is the original note.')
    expect(editor).toHaveAttribute('aria-required', 'true')
  })

  it('restores the submitted reactNote value after validation errors', async () => {
    const formData = new FormData()

    formData.append('reactNote', 'Some reply text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'reactNote', message: 'Error message' }] },
      vi.fn(),
      false,
    ])

    render(<ReactNote {...defaultProps} />)

    expect(await screen.findByRole('textbox', { name: 'label' })).toHaveTextContent('Some reply text')
  })
})
