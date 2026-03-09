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

  it('renders a description', () => {
    render(<TimeInput {...defaultProps} description="Test description" />)

    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<TimeInput {...defaultProps} errorMessage="Error!" />)

    const timeInput = screen.getByLabelText('Time')

    expect(timeInput).toHaveAccessibleDescription('Invoerfout:Error!')
  })

  it('renders with heading when hasHeading is true', () => {
    render(<TimeInput {...defaultProps} hasHeading={true} />)

    const heading = screen.getByRole('heading', { name: defaultProps.label })

    expect(heading).toBeInTheDocument()
  })

  it('passes defaultValue to ADSTimeInput', () => {
    render(<TimeInput {...defaultProps} defaultValue="12:34" />)

    expect(screen.getByDisplayValue('12:34')).toBeInTheDocument()
  })

  it('sets aria-required when required', () => {
    render(<TimeInput {...defaultProps} validate={{ required: true }} />)

    expect(screen.getByLabelText('Time')).toHaveAttribute('aria-required', 'true')
  })
})
