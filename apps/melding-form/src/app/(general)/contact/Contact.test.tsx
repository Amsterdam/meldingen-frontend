import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { Contact } from './Contact'
import { contact as contactFormData } from 'apps/melding-form/src/mocks/data'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('Contact', () => {
  it('renders an Alert and keeps input data when there is an error message', () => {
    const formData = new FormData()

    formData.append('email', 'test@example.com')
    ;(useActionState as Mock).mockReturnValue([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(<Contact formComponents={contactFormData} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      {
        validationErrors: [
          { key: 'email-input', message: 'Test email error message' },
          { key: 'tel-input', message: 'Test phone error message' },
        ],
      },
      vi.fn(),
    ])

    render(<Contact formComponents={contactFormData} />)

    const emailLink = screen.getByRole('link', { name: 'Test email error message' })
    const telLink = screen.getByRole('link', { name: 'Test phone error message' })

    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', '#email-input')
    expect(telLink).toBeInTheDocument()
    expect(telLink).toHaveAttribute('href', '#tel-input')

    // Reset the mock to its initial state
    ;(useActionState as Mock).mockReturnValue([{}, vi.fn()])
  })

  it('renders the form header', () => {
    render(<Contact formComponents={contactFormData} />)

    const header = screen.getByRole('banner', { name: 'title' })

    expect(header).toBeInTheDocument()
  })

  it('renders page and form', async () => {
    render(<Contact formComponents={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(telInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('renders descriptions that are connected to the e-mail and tel inputs', () => {
    render(<Contact formComponents={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).toHaveAccessibleDescription('Test 1')
    expect(telInput).toHaveAccessibleDescription('Test 2')
  })

  it('does not render descriptions when they are not provided', () => {
    const contactFormDataWithoutDescriptions = [
      {
        ...contactFormData[0],
        description: '',
      },
      {
        ...contactFormData[1],
        description: '',
      },
    ]

    render(<Contact formComponents={contactFormDataWithoutDescriptions} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).not.toHaveAccessibleDescription()
    expect(emailInput).not.toHaveAttribute('aria-describedby', 'email-input-description')
    expect(telInput).not.toHaveAccessibleDescription()
    expect(telInput).not.toHaveAttribute('aria-describedby', 'tel-input-description')
  })

  it('renders default values in the inputs when provided', () => {
    const contactFormDataWithDefaultValues = [
      {
        ...contactFormData[0],
        defaultValue: 'test@example.com',
      },
      {
        ...contactFormData[1],
        defaultValue: '0612345678',
      },
    ]

    render(<Contact formComponents={contactFormDataWithDefaultValues} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).toHaveValue('test@example.com')
    expect(telInput).toHaveValue('0612345678')
  })

  it('prioritizes formData values over default values in the inputs', () => {
    const formData = new FormData()

    formData.append('email', 'Email data from action')
    formData.append('tel', 'Tel data from action')
    ;(useActionState as Mock).mockReturnValue([{ formData }, vi.fn()])

    const contactFormDataWithDefaultValues = [
      {
        ...contactFormData[0],
        defaultValue: 'test@example.com',
      },
      {
        ...contactFormData[1],
        defaultValue: '0612345678',
      },
    ]

    render(<Contact formComponents={contactFormDataWithDefaultValues} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).toHaveValue('Email data from action')
    expect(telInput).toHaveValue('Tel data from action')
  })
})
