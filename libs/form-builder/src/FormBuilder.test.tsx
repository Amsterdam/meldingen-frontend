import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import { FormBuilder } from './FormBuilder'

const mockData = [
  {
    key: 'page1',
    type: 'panel',
    input: false,
    components: [
      {
        label: 'Eerste vraag',
        type: 'textfield',
      },
    ],
  },
]

describe('FormBuilder', () => {
  it('renders passed form data', () => {
    render(<FormBuilder data={mockData} onChange={vi.fn()} />)

    const input = screen.getByRole('textbox', { name: 'Eerste vraag' })

    expect(input).toBeInTheDocument()
  })
})
