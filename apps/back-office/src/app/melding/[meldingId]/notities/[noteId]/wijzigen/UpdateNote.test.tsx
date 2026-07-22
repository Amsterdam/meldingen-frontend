import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { UpdateNote } from './UpdateNote'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  meldingId: 123,
  note: {
    id: 456,
    text: 'This is a note.',
  } as NoteRetrieveOutput,
}

describe('UpdateNote', () => {
  it('renders the back link', () => {
    render(<UpdateNote {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the correct title', () => {
    render(<UpdateNote {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
  })

  it('renders the rich text editor', async () => {
    render(<UpdateNote {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: 'label' })).toBeInTheDocument()
  })

  it('renders the cancel link', () => {
    render(<UpdateNote {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })
    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('displays an API error alert when there is one', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: { detail: 'Something went wrong' } }, vi.fn()])

    const { container } = render(<UpdateNote {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toBeInTheDocument()
  })

  it('displays an invalid form alert when there are validation errors', async () => {
    const formData = new FormData()
    formData.append('updateNote', 'Some note text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'updateNote', message: 'Error message' }] },
      vi.fn(),
    ])

    render(<UpdateNote {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Error message' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'label' })).toHaveTextContent('Some note text')
  })

  it('renders a default value in the Rich Text Editor when provided', async () => {
    render(<UpdateNote {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: 'label' })).toHaveTextContent('This is a note.')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction])

    render(<UpdateNote {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
