import { render, screen } from '@testing-library/react'

import { Select } from './Select'

const requiredProps = {
  id: 'test-id',
  label: 'Test label',
  data: { values: [{ label: 'Test value', value: 'test-value' }] },
}

describe('Select Component', () => {
  it('renders the Select component', () => {
    render(<Select {...requiredProps} />)

    const select = screen.getByRole('combobox', { name: requiredProps.label })

    expect(select).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Select description="Test description" {...requiredProps} />)

    const selectWithDescription = screen.getByRole('combobox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(selectWithDescription).toBeInTheDocument()
  })

  it('renders the values', () => {
    render(<Select {...requiredProps} />)

    const selectItem = screen.getByRole('option', { name: requiredProps.data.values[0].label })

    expect(selectItem).toBeInTheDocument()
  })

  it('correctly marks Select as required', () => {
    render(<Select validate={{ required: true }} {...requiredProps} />)

    const select = screen.getByRole('combobox', { name: requiredProps.label })

    expect(select).toBeRequired()
  })
})
