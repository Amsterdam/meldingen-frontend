import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { type Props, TextArea } from './TextArea'

const defaultProps: Props = {
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
}

describe('TextArea Component', () => {
  it('renders the TextArea component', () => {
    render(<TextArea {...defaultProps} />)

    const textArea = screen.getByRole('textbox', { name: defaultProps.label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextArea {...defaultProps} description="Test description" />)

    const textAreaWithDescription = screen.getByRole('textbox', {
      name: defaultProps.label,
      description: 'Test description',
    })

    expect(textAreaWithDescription).toBeInTheDocument()
  })

  it('renders a character count', () => {
    render(<TextArea {...defaultProps} maxCharCount={80} />)

    const characterCount = screen.getByRole('status')

    expect(characterCount).toBeInTheDocument()
  })

  it('counts the number of characters', async () => {
    const user = userEvent.setup()

    render(<TextArea {...defaultProps} maxCharCount={80} />)

    const textArea = screen.getByRole('textbox', { name: defaultProps.label })

    await user.type(textArea, '0123456789')

    const characterCount = screen.getByRole('status')

    expect(characterCount).toHaveTextContent('10 van 80 tekens')
  })

  it('correctly marks TextArea as required', () => {
    render(<TextArea {...defaultProps} />)

    const textArea = screen.getByRole('textbox', { name: defaultProps.label })

    expect(textArea).toBeRequired()
  })

  it('correctly marks TextArea as not required', () => {
    render(<TextArea {...defaultProps} validate={{ required: false }} />)

    const textArea = screen.getByRole('textbox', { name: `${defaultProps.label} (niet verplicht)` })

    expect(textArea).toBeInTheDocument()
  })
})
