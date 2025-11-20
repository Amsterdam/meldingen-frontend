import { render, screen } from '@testing-library/react'

import { FormBuilder } from './FormBuilder'

const mockData = [
  {
    components: [
      {
        label: 'Eerste vraag',
        type: 'textfield',
      },
    ],
    input: false,
    key: 'page1',
    type: 'panel',
  },
]

describe('FormBuilder', () => {
  it('renders passed form data', () => {
    render(<FormBuilder data={mockData} onChange={vi.fn()} />)

    const input = screen.getByRole('textbox', { name: 'Eerste vraag' })

    expect(input).toBeInTheDocument()
  })
})
