import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  it('is a submit button', async () => {
    const user = userEvent.setup()

    const onSubmitMock = vi.fn()

    render(<FormRenderer form={mockFormData} onSubmit={onSubmitMock} />)

    const button = screen.getByRole('button')

    await user.click(button)

    expect(onSubmitMock).toBeCalledTimes(1)
  })
})
