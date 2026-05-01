import { render, screen } from '@testing-library/react'

import { SystemErrorAlert } from './SystemErrorAlert'

describe('SystemErrorAlert', () => {
  it('renders', () => {
    render(<SystemErrorAlert />)

    const alert = screen.getByRole('alert')
    const heading = screen.getByRole('heading', { name: 'system-error-alert-title' })
    const description = screen.getByText('system-error-alert-description')

    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })
})
