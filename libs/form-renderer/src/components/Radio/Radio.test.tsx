import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Radio } from './Radio'

const defaultProps = {
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
  values: [
    { label: 'Test value', value: 'test-value', position: 1 },
    { label: 'Test value 2', value: 'test-value-2', position: 2 },
  ],
  onChange: vi.fn(),
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

  it('it calls onChange with correct arguments', async () => {
    render(<Radio {...defaultProps} />)

    const radioOption = screen.getByLabelText('Test value')

    await userEvent.click(radioOption)

    expect(defaultProps.onChange).toHaveBeenCalledWith('test-value', 'test-id')
  })

  it('sets the default value', () => {
    render(<Radio {...defaultProps} defaultValue="test-value-2" />)

    const radioOption = screen.getByLabelText('Test value 2')

    expect(radioOption).toBeChecked()
  })
})
