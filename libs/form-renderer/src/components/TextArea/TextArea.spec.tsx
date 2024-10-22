import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TextArea } from './TextArea'

const requiredProps = { id: 'test-id', label: 'Test label' }

describe('TextArea Component', () => {
  it('renders the TextArea component', () => {
    render(<TextArea {...requiredProps} />)

    const textArea = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextArea description="Test description" {...requiredProps} />)

    const textAreaWithDescription = screen.getByRole('textbox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(textAreaWithDescription).toBeInTheDocument()
  })

  it('renders a character count', () => {
    render(<TextArea maxCharCount={80} {...requiredProps} />)

    const characterCount = screen.getByRole('status')

    expect(characterCount).toBeInTheDocument()
  })

  it('counts the number of characters', async () => {
    const user = userEvent.setup()

    render(<TextArea maxCharCount={80} {...requiredProps} />)

    const textArea = screen.getByRole('textbox', { name: requiredProps.label })

    await user.type(textArea, '0123456789')

    const characterCount = screen.getByRole('status')

    expect(characterCount).toHaveTextContent('10 van 80 tekens')
  })

  it('correctly marks TextArea as required', async () => {
    render(<TextArea validate={{ required: true }} {...requiredProps} />)

    const textArea = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textArea).toBeRequired()
  })
})
