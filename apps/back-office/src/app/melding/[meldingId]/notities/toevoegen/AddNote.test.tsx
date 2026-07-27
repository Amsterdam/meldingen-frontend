import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  it('renders the component with the correct document title', () => {
    render(<AddNote {...defaultProps} />)

    expect(document.title).toBe('metadata.title')
  })

  it('renders the back link', () => {
    render(<AddNote {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
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
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('displays an API error alert with the correct document title when there is an API error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: { detail: 'Something went wrong' } }, vi.fn(), false])

    const { container } = render(<AddNote {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toBeInTheDocument()
    expect(document.title).toBe('api-error-alert.heading - metadata.title')
  })

  it('displays an invalid form alert with the correct document title when there are validation errors', async () => {
    const formData = new FormData()
    formData.append('addNote', 'Some note text')
    ;(useActionState as Mock).mockReturnValueOnce([
      { formData, validationErrors: [{ key: 'addNote', message: 'Error message' }] },
      vi.fn(),
      false,
    ])

    render(<AddNote {...defaultProps} />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Error message' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'label' })).toHaveTextContent('Some note text')

    expect(document.title).toBe('document-title-error-count-prefix metadata.title')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction, false])

    render(<AddNote {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
