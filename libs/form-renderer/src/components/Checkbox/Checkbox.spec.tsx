import { render, screen } from '@testing-library/react'

import { Checkbox } from './Checkbox'

const requiredProps = { id: 'test-id', label: 'Test label', values: [{ label: 'Test value', value: 'test-value' }] }

describe('Checkbox Component', () => {
  it('renders the Checkbox component', () => {
    render(<Checkbox {...requiredProps} />)

    const checkbox = screen.getByRole('group', { name: requiredProps.label })

    expect(checkbox).toBeInTheDocument()
  })

  it('adds the description to the label', () => {
    // Because of an NVDA bug, we need to add the description to the label (https://github.com/nvaccess/nvda/issues/12718)
    // For more information, see https://designsystem.amsterdam/?path=/docs/components-forms-field-set--docs#checkbox-group
    render(<Checkbox description="Test description" {...requiredProps} />)

    const checkboxWithDescriptionAddedToLabel = screen.getByRole('group', {
      name: `${requiredProps.label} Test description`,
    })

    expect(checkboxWithDescriptionAddedToLabel).toBeInTheDocument()
  })

  it('renders the values', () => {
    render(<Checkbox {...requiredProps} />)

    const checkboxItem = screen.getByRole('checkbox', { name: requiredProps.values[0].label })

    expect(checkboxItem).toBeInTheDocument()
  })

  it('correctly marks Checkbox item as required', () => {
    render(<Checkbox validate={{ required: true }} {...requiredProps} />)

    const checkboxItem = screen.getByRole('checkbox', { name: requiredProps.values[0].label })

    expect(checkboxItem).toBeRequired()
  })
})
