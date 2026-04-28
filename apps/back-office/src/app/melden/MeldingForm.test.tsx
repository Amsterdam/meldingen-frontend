import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'
import { Mock } from 'vitest'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { URGENCY_VALUES } from '../../constants'
import { MeldingForm } from './MeldingForm'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  primaryTextArea: {
    description: 'Some description',
    label: 'Some label',
    maxCharCount: 500,
  } as StaticFormTextAreaComponentOutput,
}

describe('MeldingForm', () => {
  it('renders', () => {
    render(<MeldingForm {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: 'title' })
    const input = screen.getByRole('textbox', { name: 'Some label' })
    const description = screen.getByText('Some description')
    const submitButton = screen.getByRole('button', { name: 'submit-button' })

    expect(heading).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('initializes the character count with 0', () => {
    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByText('0 van 500 tekens')).toBeInTheDocument()
  })

  it('updates the character count when the user types in the textarea', async () => {
    const user = userEvent.setup()
    render(<MeldingForm {...defaultProps} />)

    await user.type(screen.getByRole('textbox', { name: 'Some label' }), 'Hello')

    expect(screen.getByText('5 van 500 tekens')).toBeInTheDocument()
  })

  it('does not render the character count when maxCharCount is not provided', () => {
    render(<MeldingForm primaryTextArea={{ ...defaultProps.primaryTextArea, maxCharCount: null }} />)

    expect(screen.queryByText(/500/)).not.toBeInTheDocument()
  })

  it('renders all urgency radio options', () => {
    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('radiogroup', { name: 'urgency-label' })).toBeInTheDocument()

    URGENCY_VALUES.forEach((urgency) => {
      expect(screen.getByRole('radio', { name: `urgency.${urgency}` })).toBeInTheDocument()
    })
  })

  it('checks "medium" urgency by default', () => {
    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('radio', { name: 'urgency.0' })).toBeChecked()
  })

  it('shows a validation error message when the action returns validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'primary', message: 'This field is required.' }] },
      vi.fn(),
    ])

    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByText('This field is required.')).toBeInTheDocument()
  })

  it('prefills the textarea from formData when the action returns formData', () => {
    const formData = new FormData()
    formData.set('primary', 'Prefilled text')
    ;(useActionState as Mock).mockReturnValue([{ formData }, vi.fn()])

    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('textbox')).toHaveValue('Prefilled text')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()
    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockFormAction])

    render(<MeldingForm {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    expect(mockFormAction).toHaveBeenCalled()
  })
})
