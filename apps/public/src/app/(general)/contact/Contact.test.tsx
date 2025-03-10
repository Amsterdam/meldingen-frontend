import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { Contact } from './Contact'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const mockFormData = [
  {
    type: 'textarea',
    label: 'Wat is uw e-mailadres?',
    description: 'Test 1',
    key: 'email',
    input: true,
    inputType: 'text',
    maxCharCount: 0,
    position: 0,
    autoExpand: false,
  },
  {
    type: 'textarea',
    label: 'Wat is uw telefoonnummer?',
    description: 'Test 2',
    key: 'tel',
    input: true,
    inputType: 'text',
    maxCharCount: 0,
    position: 1,
    autoExpand: false,
  },
]

describe('Contact', () => {
  it('should render page and form', async () => {
    render(<Contact formData={mockFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(telInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Contact formData={mockFormData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })

  it('should render descriptions that are connected the e-mail and tel inputs', () => {
    render(<Contact formData={mockFormData} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).toHaveAccessibleDescription('Test 1')
    expect(telInput).toHaveAccessibleDescription('Test 2')
  })

  it('should not render descriptions that are connected the e-mail and tel inputs when they are not provided', () => {
    const mockFormDataWithoutDescriptions = [
      {
        ...mockFormData[0],
        description: '',
      },
      {
        ...mockFormData[1],
        description: '',
      },
    ]

    render(<Contact formData={mockFormDataWithoutDescriptions} />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const telInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    expect(emailInput).not.toHaveAccessibleDescription()
    expect(emailInput).not.toHaveAttribute('aria-describedby', 'email-input-description')
    expect(telInput).not.toHaveAccessibleDescription()
    expect(telInput).not.toHaveAttribute('aria-describedby', 'tel-input-description')
  })
})
