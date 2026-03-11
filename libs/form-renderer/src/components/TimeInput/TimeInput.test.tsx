import { render, screen } from '@testing-library/react'

import type { Props } from './TimeInput'

import { TimeInput } from './TimeInput'

const defaultProps: Props = {
  hasHeading: false,
  id: 'time-input',
  label: 'Time',
  validate: { required: true },
}

describe('TimeInput', () => {
  it('renders label', () => {
    render(<TimeInput {...defaultProps} />)

    expect(screen.getByLabelText('Time')).toBeInTheDocument()
  })

  it('renders optional label when not required', () => {
    render(<TimeInput {...defaultProps} validate={{ required: false }} />)

    const timeInput = screen.getByLabelText('Time (niet verplicht)')

    expect(timeInput).toBeInTheDocument()
  })

  it('marks the Field and input as invalid when there is an error message', () => {
    const { container } = render(<TimeInput {...defaultProps} errorMessage="Error!" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const input = screen.getByLabelText('Time')
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

    expect(screen.getByLabelText('Time')).toHaveAccessibleDescription('Test description')
  })

  it('renders error message', () => {
    render(<TimeInput {...defaultProps} errorMessage="Error!" />)

    const timeInput = screen.getByLabelText('Time')

    expect(timeInput).toHaveAccessibleDescription('Invoerfout:Error!')
  })

  it('passes defaultValue to ADSTimeInput', () => {
    render(<TimeInput {...defaultProps} defaultValue="12:34" />)

    expect(screen.getByDisplayValue('12:34')).toBeInTheDocument()
  })

  it('correctly marks TimeInput as required', () => {
    render(<TimeInput {...defaultProps} validate={{ required: true }} />)

    const timeInput = screen.getByLabelText('Time')

    expect(timeInput).toBeRequired()
  })
})
