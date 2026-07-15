import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import { AddNote } from './AddNote'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = { meldingId: 123 }

describe('AddNote', () => {
  it('renders the back link', () => {
    render(<AddNote {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123/notities')
  })

  it('renders the correct title', () => {
    render(<AddNote {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
  })

  it('renders the rich text editor', async () => {
    render(<AddNote {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: 'label' })).toBeInTheDocument()
  })

  it('renders the cancel link', () => {
    render(<AddNote {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })
    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123/notities')
  })

  it('displays a system error alert when there is one', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ systemError: { detail: 'Something went wrong' } }, vi.fn()])

    render(<AddNote {...defaultProps} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('displays an invalid form alert when there are validation errors', async () => {
    const formData = new FormData()
    formData.append('addNote', 'Some note text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'addNote', message: 'Error message' }] },
      vi.fn(),
    ])

    render(<AddNote {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Error message' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'label' })).toHaveTextContent('Some note text')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction])

    render(<AddNote {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
