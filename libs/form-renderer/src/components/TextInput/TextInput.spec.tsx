import { render, screen } from '@testing-library/react'

import { TextInput } from './TextInput'

const requiredProps = {
  description: '',
  id: 'test-id',
  input: true,
  key: 'test-key',
  label: 'Test label',
  position: 1,
  question: 1,
  type: '',
  validate: { required: true },
}

describe('TextInput Component', () => {
  it('renders the TextInput component', () => {
    render(<TextInput {...requiredProps} key={requiredProps.key} />)

    const textInput = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextInput {...requiredProps} key={requiredProps.key} description="Test description" />)

    const textInputWithDescription = screen.getByRole('textbox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(textInputWithDescription).toBeInTheDocument()
  })

  it('correctly marks TextInput as required', () => {
    render(<TextInput {...requiredProps} key={requiredProps.key} />)

    const textInput = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textInput).toBeRequired()
  })

  it('correctly marks TextInput as not required', () => {
    render(<TextInput {...requiredProps} key={requiredProps.key} validate={{ required: false }} />)

    const textInput = screen.getByRole('textbox', { name: `${requiredProps.label} (niet verplicht)` })

    expect(textInput).toBeInTheDocument()
  })
})
