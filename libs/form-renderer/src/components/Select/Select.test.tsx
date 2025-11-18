import { render, screen } from '@testing-library/react'

import type { Props } from './Select'

import { Select } from './Select'

const defaultProps: Props = {
  data: {
    values: [
      { label: 'Test value', value: 'test-value' },
      { label: 'Test value 2', value: 'test-value-2' },
    ],
  },
  hasHeading: true,
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
      description: 'Test description',
      name: defaultProps.label,
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

  it('renders a heading if hasHeading is true', () => {
    render(<Select {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: defaultProps.label })

    expect(heading).toBeInTheDocument()
  })

  it('does not render a heading if hasHeading is false', () => {
    render(<Select {...defaultProps} hasHeading={false} />)

    const heading = screen.queryByRole('heading')

    expect(heading).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    render(<Select {...defaultProps} errorMessage="Test error message" />)

    const selectWithErrorMessage = screen.getByRole('combobox', {
      description: 'Invoerfout: Test error message',
      name: defaultProps.label,
    })

    expect(selectWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and Select as invalid when there is an error message', () => {
    const { container } = render(<Select {...defaultProps} errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const select = screen.getByRole('combobox', { name: defaultProps.label })
    expect(select).toHaveAttribute('aria-invalid', 'true')
  })
})
