import { render, screen } from '@testing-library/react'

import { Checkbox } from './Checkbox'

const defaultProps = {
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
  values: [{ label: 'Test value', value: 'test-value' }],
}

describe('Checkbox Component', () => {
  it('renders the Checkbox component', () => {
    render(<Checkbox {...defaultProps} />)

    const checkbox = screen.getByRole('group', { name: defaultProps.label })

    expect(checkbox).toBeInTheDocument()
  })

  it('adds the description to the label', () => {
    // Because of an NVDA bug, we need to add the description to the label (https://github.com/nvaccess/nvda/issues/12718)
    // For more information, see https://designsystem.amsterdam/?path=/docs/components-forms-field-set--docs#checkbox-group
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
})
