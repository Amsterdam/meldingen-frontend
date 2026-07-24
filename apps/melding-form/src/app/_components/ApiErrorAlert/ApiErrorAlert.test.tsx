import { render, screen } from '@testing-library/react'

import { ApiErrorAlert } from './ApiErrorAlert'

describe('ApiErrorAlert', () => {
  it('renders', () => {
    render(<ApiErrorAlert shouldFocus={false} />)

    const heading = screen.getByRole('heading', { name: 'heading' })
    const description = screen.getByText('description')

    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it('sets focus on the alert when shouldFocus is true', () => {
    render(<ApiErrorAlert shouldFocus />)

    const heading = screen.getByRole('heading', { name: 'heading' })
    const alert = heading.closest('section')

    expect(alert).toHaveFocus()
  })

  it('does not set focus on the alert when shouldFocus is false', () => {
    render(<ApiErrorAlert shouldFocus={false} />)

    const heading = screen.getByRole('heading', { name: 'heading' })
    const alert = heading.closest('section')

    expect(alert).not.toHaveFocus()
  })
})
