import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Select } from './Select'

const defaultProps = {
  data: {
    values: [
      { label: 'Test value', value: 'test-value', position: 1 },
      { label: 'Test value 2', value: 'test-value-2', position: 2 },
    ],
  },
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
  onChange: vi.fn(),
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

  it('it calls onChange with correct arguments', async () => {
    render(<Select {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: defaultProps.label })

    await userEvent.selectOptions(select, 'test-value')

    expect(defaultProps.onChange).toHaveBeenCalledWith('test-value', 'test-id')
    expect(select).toHaveValue('test-value')
  })

  it('sets the default value', () => {
    render(<Select {...defaultProps} defaultValue="test-value-2" />)

    const select = screen.getByRole('combobox', { name: defaultProps.label })

    expect(select).toHaveValue('test-value-2')
  })
})
