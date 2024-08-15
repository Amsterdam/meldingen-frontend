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
  it('should render a button', async () => {
    render(<FormRenderer form={mockFormData} />)

    const button = screen.getByRole('button')

    expect(button).toBeInTheDocument()
  })
})
