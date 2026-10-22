import { render, screen } from '@testing-library/react'

import { FocusableAlert } from './FocusableAlert'

const defaultProps = {
  description: 'Description',
  focusKey: false,
  heading: 'Heading',
}

describe('FocusableAlert', () => {
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
      <FocusableAlert focusKey={false} heading="Heading">
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

  it.each([true, 'truthy string', {}])('sets focus on the alert when focusKey has truthy value "%s"', (value) => {
    const { container } = render(<FocusableAlert {...defaultProps} focusKey={value} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })

  it.each([false, '', 0])('does not set focus on the alert when focusKey has falsy value "%s"', (value) => {
    const { container } = render(<FocusableAlert {...defaultProps} focusKey={value} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).not.toHaveFocus()
  })

  it('sets focus on the alert again when focusKey changes to a new truthy value', () => {
    const { container, rerender } = render(<FocusableAlert {...defaultProps} focusKey={{}} />)

    const alert = container.querySelector<HTMLElement>('.ams-alert')

    alert?.blur()

    rerender(<FocusableAlert {...defaultProps} focusKey={{}} />)

    expect(alert).toHaveFocus()
  })

  it('does not set focus on the alert again when focusKey stays the same', () => {
    const focusKey = {}
    const { container, rerender } = render(<FocusableAlert {...defaultProps} focusKey={focusKey} />)

    const alert = container.querySelector<HTMLElement>('.ams-alert')

    alert?.blur()

    rerender(<FocusableAlert {...defaultProps} description="Updated description" focusKey={focusKey} />)

    expect(alert).not.toHaveFocus()
  })
})
