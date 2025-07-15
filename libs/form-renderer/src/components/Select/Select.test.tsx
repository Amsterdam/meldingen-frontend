import { render, screen } from '@testing-library/react'

import { type Props, Select } from './Select'

const defaultProps: Props = {
  data: {
    values: [
      { label: 'Test value', value: 'test-value' },
      { label: 'Test value 2', value: 'test-value-2' },
    ],
  },
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
}

describe('Select Component', () => {
  it('renders the Select component', () => {
    render(<Select {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: defaultProps.label })

    expect(select).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Select {...defaultProps} description="Test description" />)

    const selectWithDescription = screen.getByRole('combobox', {
      name: defaultProps.label,
      description: 'Test description',
    })

    expect(selectWithDescription).toBeInTheDocument()
  })

  it('renders the Select options', () => {
    render(<Select {...defaultProps} />)

    const selectItem = screen.getByRole('option', { name: defaultProps.data.values[0].label })

    expect(selectItem).toBeInTheDocument()
  })

  it('correctly marks Select as required', () => {
    render(<Select {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: defaultProps.label })

    expect(select).toBeRequired()
  })

  it('correctly marks Select as not required', () => {
    render(<Select {...defaultProps} validate={{ required: false }} />)

    const select = screen.getByRole('combobox', { name: `${defaultProps.label} (niet verplicht)` })

    expect(select).toBeInTheDocument()
  })

  it('sets the default value', () => {
    render(<Select {...defaultProps} defaultValue="test-value-2" />)

    const select = screen.getByRole('combobox', { name: defaultProps.label })

    expect(select).toHaveValue('test-value-2')
  })
})
