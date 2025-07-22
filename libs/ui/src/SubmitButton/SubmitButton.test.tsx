import { render, screen } from '@testing-library/react'

import { SubmitButton } from './SubmitButton'

describe('SubmitButton', () => {
  it('renders a button with type submit', () => {
    render(<SubmitButton>Test</SubmitButton>)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('renders the correct class', () => {
    render(<SubmitButton>Test</SubmitButton>)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toHaveClass(/button/)
  })

  it('forwards extra props to the button', () => {
    render(<SubmitButton data-test="test">Test</SubmitButton>)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toHaveAttribute('data-test', 'test')
  })
})
