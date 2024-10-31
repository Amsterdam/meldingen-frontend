import { render, screen } from '@testing-library/react'

import { Select } from './Select'

const requiredProps = {
  data: { values: [{ label: 'Test value', value: 'test-value', position: 1 }] },
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
}

describe('Select Component', () => {
  it('renders the Select component', () => {
    render(<Select {...requiredProps} />)

    const select = screen.getByRole('combobox', { name: requiredProps.label })

    expect(select).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Select {...requiredProps} description="Test description" />)

    const selectWithDescription = screen.getByRole('combobox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(selectWithDescription).toBeInTheDocument()
  })

  it('renders the Select options', () => {
    render(<Select {...requiredProps} />)

    const selectItem = screen.getByRole('option', { name: requiredProps.data.values[0].label })

    expect(selectItem).toBeInTheDocument()
  })

  it('correctly marks Select as required', () => {
    render(<Select {...requiredProps} />)

    const select = screen.getByRole('combobox', { name: requiredProps.label })

    expect(select).toBeRequired()
  })

  it('correctly marks Select as not required', () => {
    render(<Select {...requiredProps} validate={{ required: false }} />)

    const select = screen.getByRole('combobox', { name: `${requiredProps.label} (niet verplicht)` })

    expect(select).toBeInTheDocument()
  })
})
