import { render, screen } from '@testing-library/react'

import { InvalidFormAlert } from './InvalidFormAlert'

const defaultProps = {
  errors: [
    { key: 'field1', message: 'Field 1 is required' },
    { key: 'field2', message: 'Field 2 is invalid' },
  ],
  shouldFocus: false,
}

describe('InvalidFormAlert', () => {
  it('renders the default heading', () => {
    render(<InvalidFormAlert {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 2, name: 'invalid-form-alert-title' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a custom heading when provided', () => {
    render(<InvalidFormAlert {...defaultProps} heading="Custom heading" />)

    const heading = screen.getByRole('heading', { name: 'Custom heading' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a link for every error with the correct name and href', () => {
    render(<InvalidFormAlert {...defaultProps} />)

    const link1 = screen.getByRole('link', { name: defaultProps.errors[0].message })
    const link2 = screen.getByRole('link', { name: defaultProps.errors[1].message })

    expect(link1).toHaveAttribute('href', `#${defaultProps.errors[0].key}`)
    expect(link2).toHaveAttribute('href', `#${defaultProps.errors[1].key}`)
  })
})
