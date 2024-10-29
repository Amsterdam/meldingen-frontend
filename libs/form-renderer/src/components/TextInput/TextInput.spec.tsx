import { render, screen } from '@testing-library/react'

import { TextInput } from './TextInput'

const requiredProps = { id: 'test-id', label: 'Test label' }

describe('TextInput Component', () => {
  it('renders the TextInput component', () => {
    render(<TextInput {...requiredProps} />)

    const textInput = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextInput description="Test description" {...requiredProps} />)

    const textInputWithDescription = screen.getByRole('textbox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(textInputWithDescription).toBeInTheDocument()
  })

  it('correctly marks TextInput as required', () => {
    render(<TextInput validate={{ required: true }} {...requiredProps} />)

    const textInput = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textInput).toBeRequired()
  })
})
