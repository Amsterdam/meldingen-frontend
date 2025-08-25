import { render, screen } from '@testing-library/react'

import { type Props, Radio } from './Radio'

const defaultProps: Props = {
  hasHeading: true,
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
  values: [
    { label: 'Test value', value: 'test-value' },
    { label: 'Test value 2', value: 'test-value-2' },
  ],
}

describe('Radio Component', () => {
  it('renders the Radio component', () => {
    render(<Radio {...defaultProps} />)

    const radio = screen.getByRole('radiogroup', { name: defaultProps.label })

    expect(radio).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Radio {...defaultProps} description="Test description" />)

    const radioWithDescription = screen.getByRole('radiogroup', {
      name: defaultProps.label,
      description: 'Test description',
    })

    expect(radioWithDescription).toBeInTheDocument()
  })

  it('renders the Radio items', () => {
    render(<Radio {...defaultProps} />)

    const radioItem = screen.getByRole('radio', { name: defaultProps.values[0].label })

    expect(radioItem).toBeInTheDocument()
  })

  it('correctly marks Radio as required', () => {
    render(<Radio {...defaultProps} />)

    const radio = screen.getByRole('radiogroup', { name: defaultProps.label })

    expect(radio).toBeRequired()
  })

  it('correctly marks Radio as not required', () => {
    render(<Radio {...defaultProps} validate={{ required: false }} />)

    const radio = screen.getByRole('radiogroup', { name: `${defaultProps.label} (niet verplicht)` })

    expect(radio).toBeInTheDocument()
  })

  it('correctly marks Radio item as required', () => {
    render(<Radio {...defaultProps} />)

    const radioItem = screen.getByRole('radio', { name: defaultProps.values[0].label })

    expect(radioItem).toBeRequired()
  })

  it('sets the default value', () => {
    render(<Radio {...defaultProps} defaultValue="test-value-2" />)

    const radioOption = screen.getByLabelText('Test value 2')

    expect(radioOption).toBeChecked()
  })

  it('renders an error message when there is one', () => {
    render(<Radio {...defaultProps} errorMessage="Test error message" />)

    const radioWithErrorMessage = screen.getByRole('radiogroup', {
      name: defaultProps.label,
      description: 'Invoerfout: Test error message',
    })

    expect(radioWithErrorMessage).toBeInTheDocument()
  })

  it('marks the FieldSet and Radio buttons as invalid when there is an error message', () => {
    render(<Radio {...defaultProps} errorMessage="Test error message" />)

    const fieldSet = screen.getByRole('radiogroup')
    expect(fieldSet).toHaveClass('ams-field-set--invalid')

    const inputs = screen.getAllByRole('radio')
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
