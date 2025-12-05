import { render, screen } from '@testing-library/react'

import type { Props } from './TextInput'

import { TextInput } from './TextInput'

const defaultProps: Props = {
  hasHeading: true,
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
}

describe('TextInput Component', () => {
  it('renders the TextInput component', () => {
    render(<TextInput {...defaultProps} />)

    const textInput = screen.getByRole('textbox', { name: defaultProps.label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextInput {...defaultProps} description="Test description" />)

    const textInputWithDescription = screen.getByRole('textbox', {
      description: 'Test description',
      name: defaultProps.label,
    })

    expect(textInputWithDescription).toBeInTheDocument()
  })

  it('correctly marks TextInput as required', () => {
    render(<TextInput {...defaultProps} />)

    const textInput = screen.getByRole('textbox', { name: defaultProps.label })

    expect(textInput).toBeRequired()
  })

  it('correctly marks TextInput as not required', () => {
    render(<TextInput {...defaultProps} validate={{ required: false }} />)

    const textInput = screen.getByRole('textbox', { name: `${defaultProps.label} (niet verplicht)` })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a heading if hasHeading is true', () => {
    render(<TextInput {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: defaultProps.label })

    expect(heading).toBeInTheDocument()
  })

  it('does not render a heading if hasHeading is false', () => {
    render(<TextInput {...defaultProps} hasHeading={false} />)

    const heading = screen.queryByRole('heading')

    expect(heading).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    render(<TextInput {...defaultProps} errorMessage="Test error message" />)

    const textInputWithErrorMessage = screen.getByRole('textbox', {
      description: 'Invoerfout:Test error message',
      name: defaultProps.label,
    })

    expect(textInputWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and input as invalid when there is an error message', () => {
    const { container } = render(<TextInput {...defaultProps} errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const input = screen.getByRole('textbox', { name: defaultProps.label })
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
