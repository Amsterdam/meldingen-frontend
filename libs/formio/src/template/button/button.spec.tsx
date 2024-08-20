import { render, screen } from '@testing-library/react'

import { FormRenderer } from '../../FormRenderer'

const testLabel = 'Test label'

const mockFormData = {
  display: 'form',
  components: [
    {
      label: testLabel,
      type: 'button',
    },
  ],
}

describe('Button', () => {
  it('renders', () => {
    render(<FormRenderer form={mockFormData} />)

    const button = screen.getByRole('button')

    expect(button).toBeInTheDocument()
  })

  it('has the correct classes', () => {
    render(<FormRenderer form={mockFormData} />)

    const button = screen.getByRole('button')

    expect(button).toHaveClass('ams-button ams-button--primary')
  })

  it('renders a label', () => {
    render(<FormRenderer form={mockFormData} />)

    const button = screen.getByRole('button', { name: testLabel })

    expect(button).toBeInTheDocument()
  })
})
