import { render, screen } from '@testing-library/react'

import type { Props } from './Checkbox'

import { Checkbox } from './Checkbox'

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

describe('Checkbox Component', () => {
  it('renders the Checkbox component', () => {
    render(<Checkbox {...defaultProps} />)

    const checkbox = screen.getByRole('group', { name: defaultProps.label })

    expect(checkbox).toBeInTheDocument()
  })

  it('adds the description to the label', () => {
    // Because of an NVDA bug, we need to add the description and error to the label
    render(<Checkbox {...defaultProps} description="Test description" />)

    const checkboxWithDescriptionAddedToLabel = screen.getByRole('group', {
      name: `${defaultProps.label} Test description`,
    })

    expect(checkboxWithDescriptionAddedToLabel).toBeInTheDocument()
  })

  it('renders the Checkbox items', () => {
    render(<Checkbox {...defaultProps} />)

    const checkboxItem = screen.getByRole('checkbox', { name: defaultProps.values[0].label })

    expect(checkboxItem).toBeInTheDocument()
  })

  it('correctly marks Checkbox as not required', () => {
    render(<Checkbox {...defaultProps} validate={{ required: false }} />)

    const checkbox = screen.getByRole('group', { name: `${defaultProps.label} (niet verplicht)` })

    expect(checkbox).toBeInTheDocument()
  })

  it('correctly marks Checkbox item as required', () => {
    render(<Checkbox {...defaultProps} />)

    const checkboxItem = screen.getByRole('checkbox', { name: defaultProps.values[0].label })

    expect(checkboxItem).toBeRequired()
  })

  it('sets the default values', () => {
    render(<Checkbox {...defaultProps} defaultValues={['test-value', 'test-value-2']} />)

    const checkboxItem1 = screen.getByRole('checkbox', { name: defaultProps.values[0].label })
    const checkboxItem2 = screen.getByRole('checkbox', { name: defaultProps.values[1].label })

    expect(checkboxItem1).toBeChecked()
    expect(checkboxItem2).toBeChecked()
  })

  it('renders an error message when there is one', () => {
    render(<Checkbox {...defaultProps} errorMessage="Test error message" />)

    const checkboxWithErrorAddedToLabel = screen.getByRole('group', {
      name: `${defaultProps.label} Invoerfout: Test error message`,
    })

    expect(checkboxWithErrorAddedToLabel).toBeInTheDocument()
  })

  it('marks the FieldSet and Checkboxes as invalid when there is an error message', () => {
    render(<Checkbox {...defaultProps} errorMessage="Test error message" />)

    const fieldSet = screen.getByRole('group')
    expect(fieldSet).toHaveClass('ams-field-set--invalid')

    const inputs = screen.getAllByRole('checkbox')
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
