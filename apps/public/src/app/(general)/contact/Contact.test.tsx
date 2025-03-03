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
    const phoneInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(phoneInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Contact formData={mockFormData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
