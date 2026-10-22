import { render, screen } from '@testing-library/react'

import { ResponsiveSubmitButton } from './ResponsiveSubmitButton'

const defaultProps = {
  isLoading: false,
  label: 'Test',
  loadingLabel: 'Loading',
}

describe('ResponsiveSubmitButton', () => {
  it('renders the correct class', () => {
    render(<ResponsiveSubmitButton {...defaultProps} />)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toHaveClass(/button/)
  })

  it('renders an extra class', () => {
    render(<ResponsiveSubmitButton {...defaultProps} className="extra-class" />)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toHaveClass('extra-class')
  })
})
