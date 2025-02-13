import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { Home } from './Home'

const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const mockFormData = [
  {
    type: 'textarea',
    key: 'what',
    label: mockQuestionText.source, // This converts the regex to a string
    description: '',
    input: true,
    inputType: 'text',
    showCharCount: false,
    position: 0,
  },
]

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('Page', () => {
  it('should render a form', () => {
    render(<Home formData={mockFormData} />)

    expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Home formData={mockFormData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
