import { render, screen } from '@testing-library/react'

import { FocusableAlert } from './FocusableAlert'

const defaultProps = {
  description: 'Description',
  heading: 'Heading',
  shouldFocus: false,
}

describe('Alert', () => {
  it('renders an alert', () => {
    const { container } = render(<FocusableAlert {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toBeInTheDocument()
  })

  it('renders its description when provided', () => {
    render(<FocusableAlert {...defaultProps} />)

    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders its children when provided instead of a description', () => {
    render(
      <FocusableAlert heading="Heading" shouldFocus={false}>
        Child content
      </FocusableAlert>,
    )

    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders the correct class', () => {
    const { container } = render(<FocusableAlert {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveClass(/alert/)
  })

  it('renders an extra class when provided', () => {
    const { container } = render(<FocusableAlert {...defaultProps} className="extra-class" />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveClass('extra-class')
  })

  it('renders the correct heading level', () => {
    render(<FocusableAlert {...defaultProps} headingLevel={4} />)

    const heading = screen.getByRole('heading', { level: 4 })

    expect(heading).toBeInTheDocument()
  })

  it('sets focus on the alert when shouldFocus is true', () => {
    const { container } = render(<FocusableAlert {...defaultProps} shouldFocus />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })

  it('does not set focus on the alert when shouldFocus is false', () => {
    const { container } = render(<FocusableAlert {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).not.toHaveFocus()
  })
})
