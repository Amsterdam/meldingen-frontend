import { render, screen } from '@testing-library/react'

import { ApiErrorAlert } from './ApiErrorAlert'

const defaultProps = {
  description: 'Test description',
  heading: 'Test heading',
  headingLevel: 2,
  shouldRefocus: false,
} as const

describe('Api Error Alert', () => {
  it('renders', () => {
    render(<ApiErrorAlert {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Test heading' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a custom heading', () => {
    render(<ApiErrorAlert {...defaultProps} heading="Custom heading" />)

    const heading = screen.getByRole('heading', { name: 'Custom heading' })

    expect(heading).toBeInTheDocument()
  })

  it('renders an extra class name', () => {
    const { container } = render(<ApiErrorAlert className="extra" {...defaultProps} />)

    const alert = container.querySelector(':only-child')

    expect(alert).toHaveClass('extra')
  })

  it('renders the correct heading level', () => {
    render(<ApiErrorAlert {...defaultProps} headingLevel={4} />)

    const heading = screen.getByRole('heading', { level: 4 })

    expect(heading).toBeInTheDocument()
  })

  it('sets focus on the alert when shouldRefocus is true', () => {
    render(<ApiErrorAlert {...defaultProps} shouldRefocus />)

    const heading = screen.getByRole('heading', { name: 'Test heading' })
    const alert = heading.closest('section')

    expect(alert).toHaveFocus()
  })

  it('does not set focus on the alert when shouldRefocus is false', () => {
    render(<ApiErrorAlert {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: 'Test heading' })
    const alert = heading.closest('section')

    expect(alert).not.toHaveFocus()
  })
})
