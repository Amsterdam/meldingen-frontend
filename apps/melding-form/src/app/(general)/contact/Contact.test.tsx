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
    ;(useActionState as Mock).mockReturnValue([{ errorMessage: 'Test error message', formData }, vi.fn()])

    render(<Contact formComponents={contactFormData} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('Test error message')

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

  it('should render page and form', async () => {
    render(<Contact formComponents={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(telInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should render descriptions that are connected to the e-mail and tel inputs', () => {
    render(<Contact formComponents={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).toHaveAccessibleDescription('Test 1')
    expect(telInput).toHaveAccessibleDescription('Test 2')
  })

  it('should not render descriptions when they are not provided', () => {
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
})
