import { render, screen } from '@testing-library/react'

import { Alert } from './Alert'

const defaultProps = {
  children: 'Test',
  description: 'Description',
  heading: 'Heading',
  shouldFocus: false,
}

describe('Alert', () => {
  it('renders an alert', () => {
    render(<Alert {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toBeInTheDocument()
  })

  it('renders the correct class', () => {
    render(<Alert {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveClass(/alert/)
  })

  it('renders an extra class when provided', () => {
    render(<Alert {...defaultProps} className="extra-class" />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveClass('extra-class')
  })

  it('renders the correct heading level', () => {
    render(<Alert {...defaultProps} headingLevel={4} />)

    const heading = screen.getByRole('heading', { level: 4 })

    expect(heading).toBeInTheDocument()
  })

  it('sets focus on the alert when shouldFocus is true', () => {
    render(<Alert {...defaultProps} shouldFocus />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveFocus()
  })

  it('does not set focus on the alert when shouldFocus is false', () => {
    render(<Alert {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).not.toHaveFocus()
  })
})
