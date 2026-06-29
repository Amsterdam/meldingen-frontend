import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { FormState } from './actions'

import { AddNote } from './AddNote'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  meldingId: 123,
}

describe('AddNote', () => {
  beforeEach(() => {
    ;(useActionState as Mock).mockReturnValue([{}, vi.fn()])
  })

  it('renders the backlink', () => {
    render(<AddNote {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the component with the correct title and textarea', () => {
    render(<AddNote {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'label' })).toBeInTheDocument()
  })

  it('renders the cancel link', () => {
    render(<AddNote {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })

    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders a validation alert and keeps the submitted text', () => {
    const formState: FormState = {
      textFromAction: 'Existing note',
      validationErrors: [{ key: 'text', message: 'errors.validation.required' }],
    }
    ;(useActionState as Mock).mockReturnValue([formState, vi.fn()])

    render(<AddNote {...defaultProps} />)

    const alert = screen.getByRole('alert', { name: 'errors.validation.heading' })
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.validation.required')

    expect(screen.getByRole('textbox', { name: 'label' })).toHaveValue('Existing note')
  })

  it('renders a system error alert', () => {
    const formState: FormState = {
      systemError: 'Something went wrong',
      textFromAction: 'Existing note',
    }
    ;(useActionState as Mock).mockReturnValue([formState, vi.fn()])

    render(<AddNote {...defaultProps} />)

    const alert = screen.getByRole('alert', { name: 'errors.system.heading' })
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Something went wrong')
  })

  it('updates the character count when the user types in the textarea', async () => {
    const user = userEvent.setup()

    render(<AddNote {...defaultProps} />)

    await user.type(screen.getByRole('textbox', { name: 'label' }), 'Hello')

    expect(screen.getByText('5 van 3000 tekens')).toBeInTheDocument()
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockFormAction])

    render(<AddNote {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
