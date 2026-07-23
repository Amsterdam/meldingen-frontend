import { render, screen } from '@testing-library/react'

import { InvalidFormAlert } from './InvalidFormAlert'

describe('InvalidFormAlert', () => {
  const testErrors = [
    { key: 'field1', message: 'Field 1 is required' },
    { key: 'field2', message: 'Field 2 is invalid' },
  ]

  it('renders the default heading', () => {
    render(<InvalidFormAlert errors={testErrors} />)

    const heading = screen.getByRole('heading', { level: 2, name: 'invalid-form-alert-title' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a custom heading when provided', () => {
    render(<InvalidFormAlert errors={testErrors} heading="Custom heading" />)

    const heading = screen.getByRole('heading', { name: 'Custom heading' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a link for every error with the correct name and href', () => {
    render(<InvalidFormAlert errors={testErrors} />)

    const link1 = screen.getByRole('link', { name: testErrors[0].message })
    const link2 = screen.getByRole('link', { name: testErrors[1].message })

    expect(link1).toHaveAttribute('href', `#${testErrors[0].key}`)
    expect(link2).toHaveAttribute('href', `#${testErrors[1].key}`)
  })
})
