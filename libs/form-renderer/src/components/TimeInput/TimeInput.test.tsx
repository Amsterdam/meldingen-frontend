import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Props } from './TimeInput'

import { TimeInput } from './TimeInput'

const defaultProps: Props = {
  hasHeading: false,
  id: 'time-input',
  label: 'Time',
  onChange: vi.fn(),
  validate: { required: true },
}

describe('TimeInput', () => {
  it('renders the Time Input field set', () => {
    render(<TimeInput {...defaultProps} />)

    const fieldSet = screen.getByRole('group', { name: defaultProps.label })

    expect(fieldSet).toBeInTheDocument()
  })

  it('renders optional label when not required', () => {
    render(<TimeInput {...defaultProps} validate={{ required: false }} />)

    const fieldSet = screen.getByRole('group', { name: 'Time (niet verplicht)' })

    expect(fieldSet).toBeInTheDocument()
  })

  it('marks the Field Set and input as invalid when there is an error message', () => {
    const { container } = render(<TimeInput {...defaultProps} errorMessage="Error!" />)

    const fieldSet = screen.getByRole('group', { name: defaultProps.label })
    expect(fieldSet).toHaveClass('ams-field-set--invalid')

    const input = container.querySelector('input[type="time"]')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders with heading when hasHeading is true', () => {
    render(<TimeInput {...defaultProps} hasHeading={true} />)

    const heading = screen.getByRole('heading', { name: defaultProps.label })

    expect(heading).toBeInTheDocument()
  })

  it('does not render with heading when hasHeading is false', () => {
    render(<TimeInput {...defaultProps} hasHeading={false} />)

    const heading = screen.queryByRole('heading', { name: defaultProps.label })

    expect(heading).not.toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TimeInput {...defaultProps} description="Test description" />)

    const fieldSet = screen.getByRole('group', { name: defaultProps.label })

    expect(fieldSet).toHaveAccessibleDescription('Test description')
  })

  it('renders error message', () => {
    render(<TimeInput {...defaultProps} errorMessage="Error!" />)

    const fieldSet = screen.getByRole('group', { name: defaultProps.label })

    expect(fieldSet).toHaveAccessibleDescription('Invoerfout:Error!')
  })

  it('passes defaultValue to ADSTimeInput', () => {
    render(<TimeInput {...defaultProps} defaultValue="12:34" />)

    expect(screen.getByDisplayValue('12:34')).toBeInTheDocument()
  })

  it('correctly marks the input in the TimeInput group as required', () => {
    render(<TimeInput {...defaultProps} defaultValue="12:34" validate={{ required: true }} />)

    const input = screen.getByDisplayValue('12:34')

    expect(input).toBeRequired()
  })

  it('calls onChange with the correct value when the value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<TimeInput {...defaultProps} defaultValue="11:11" onChange={onChange} />)

    const input = screen.getByDisplayValue('11:11')

    await user.type(input, '12:34', {
      initialSelectionEnd: (input as HTMLInputElement).value.length,
      initialSelectionStart: 0,
    })

    expect(onChange).toHaveBeenLastCalledWith('12:34')
  })

  it('calls onChange with null when the Checkbox is checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<TimeInput {...defaultProps} defaultValue="12:34" onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Weet ik niet' })

    await user.click(checkbox)

    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('restores the previous time value when the Checkbox is unchecked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<TimeInput {...defaultProps} defaultValue="12:34" onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Weet ik niet' })

    await user.click(checkbox)
    expect(onChange).toHaveBeenLastCalledWith(null)

    await user.click(checkbox)
    expect(onChange).toHaveBeenLastCalledWith('12:34')
  })

  it('unchecks the Checkbox when a time value is entered', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<TimeInput {...defaultProps} defaultValue="11:11" onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Weet ik niet' })
    const input = screen.getByDisplayValue('11:11')

    await user.click(checkbox)

    expect(checkbox).toBeChecked()

    await user.type(input, '12:34')

    expect(checkbox).not.toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith('12:34')
  })
})
