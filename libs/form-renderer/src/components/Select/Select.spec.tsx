import { render, screen } from '@testing-library/react'

import { Select } from './Select'

const requiredProps = {
  data: { values: [{ label: 'Test value', value: 'test-value', position: 1 }] },
  description: '',
  id: 'test-id',
  input: true,
  key: 'test-key',
  label: 'Test label',
  placeholder: '',
  position: 1,
  type: '',
  question: 1,
  validate: { required: true },
  widget: '',
}

describe('Select Component', () => {
  it('renders the Select component', () => {
    render(<Select {...requiredProps} key={requiredProps.key} />)

    const select = screen.getByRole('combobox', { name: requiredProps.label })

    expect(select).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Select {...requiredProps} key={requiredProps.key} description="Test description" />)

    const selectWithDescription = screen.getByRole('combobox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(selectWithDescription).toBeInTheDocument()
  })

  it('renders the Select options', () => {
    render(<Select {...requiredProps} key={requiredProps.key} />)

    const selectItem = screen.getByRole('option', { name: requiredProps.data.values[0].label })

    expect(selectItem).toBeInTheDocument()
  })

  it('correctly marks Select as required', () => {
    render(<Select {...requiredProps} key={requiredProps.key} />)

    const select = screen.getByRole('combobox', { name: requiredProps.label })

    expect(select).toBeRequired()
  })

  it('correctly marks Select as not required', () => {
    render(<Select {...requiredProps} key={requiredProps.key} validate={{ required: false }} />)

    const select = screen.getByRole('combobox', { name: `${requiredProps.label} (niet verplicht)` })

    expect(select).toBeInTheDocument()
  })
})
