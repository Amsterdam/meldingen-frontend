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
  it('should render page and form', async () => {
    render(<Contact formComponents={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(telInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ errorMessage: 'Test error message' }, vi.fn()])

    render(<Contact formComponents={contactFormData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
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
