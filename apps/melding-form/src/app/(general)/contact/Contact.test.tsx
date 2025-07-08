import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    render(<Contact formData={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(telInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Contact formData={contactFormData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })

  it('should render descriptions that are connected to the e-mail and tel inputs', () => {
    render(<Contact formData={contactFormData} />)

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

    render(<Contact formData={contactFormDataWithoutDescriptions} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).not.toHaveAccessibleDescription()
    expect(emailInput).not.toHaveAttribute('aria-describedby', 'email-input-description')
    expect(telInput).not.toHaveAccessibleDescription()
    expect(telInput).not.toHaveAttribute('aria-describedby', 'tel-input-description')
  })

  it('should set default data from localStorage', () => {
    const store: Record<string, string> = { email: 'test@mail.com', phone: '0612345678' }

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
    } as unknown as Storage

    render(<Contact formData={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })

    expect(emailInput).toHaveValue('test@mail.com')

    const phoneInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(phoneInput).toHaveValue('0612345678')
  })

  it('should handle onChange and set value in localStorage', async () => {
    const store: Record<string, string> = { email: '', phone: '' }

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
    } as unknown as Storage

    render(<Contact formData={contactFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })

    await userEvent.type(emailInput, 'test@mail.com')

    expect(global.localStorage.setItem).toHaveBeenCalledWith('email', '"test@mail.com"')
  })
})
