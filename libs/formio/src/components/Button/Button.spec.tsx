import { render, screen } from '@testing-library/react'

import { FormRenderer } from '../../FormRenderer'

const mockFormData = {
  display: 'form',
  components: [
    {
      type: 'button',
    },
  ],
}

describe('Button', () => {
  it('should render', () => {
    render(<FormRenderer form={mockFormData} />)

    const button = screen.getByRole('button')

    expect(button).toBeInTheDocument()
  })

  it('has the correct classes', () => {
    render(<FormRenderer form={mockFormData} />)

    const button = screen.getByRole('button')

    expect(button).toHaveClass('ams-button ams-button--primary')
  })
})
