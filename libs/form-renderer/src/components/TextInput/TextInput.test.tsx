import { render, screen } from '@testing-library/react'

import { type Props, TextInput } from './TextInput'

const defaultProps: Props = {
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
      name: defaultProps.label,
      description: 'Test description',
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
})
