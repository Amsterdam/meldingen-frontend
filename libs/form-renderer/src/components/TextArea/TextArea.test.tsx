import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Props } from './TextArea'

import { TextArea } from './TextArea'

const defaultProps: Props = {
  hasHeading: true,
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
      description: 'Test description',
      name: defaultProps.label,
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

  it('counts the length of defaultValue if supplied', () => {
    render(<TextArea {...defaultProps} defaultValue="Test" maxCharCount={100} />)

    const characterCount = screen.getByRole('status')

    expect(characterCount).toHaveTextContent('4 van 100 tekens')
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

  it('renders a heading if hasHeading is true', () => {
    render(<TextArea {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: defaultProps.label })

    expect(heading).toBeInTheDocument()
  })

  it('does not render a heading if hasHeading is false', () => {
    render(<TextArea {...defaultProps} hasHeading={false} />)

    const heading = screen.queryByRole('heading')

    expect(heading).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    render(<TextArea {...defaultProps} errorMessage="Test error message" />)

    const textAreaWithErrorMessage = screen.getByRole('textbox', {
      description: 'Invoerfout: Test error message',
      name: defaultProps.label,
    })

    expect(textAreaWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and input as invalid when there is an error message', () => {
    const { container } = render(<TextArea {...defaultProps} errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const input = screen.getByRole('textbox', { name: defaultProps.label })
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
