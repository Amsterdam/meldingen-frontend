import { render, screen } from '@testing-library/react'

import Contact from './page'

describe('Contact', () => {
  it('should render page and form', async () => {
    render(<Contact />)

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const phoneInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })
    const submitButton = screen.getByRole('button')

    expect(emailInput).toBeInTheDocument()
    expect(phoneInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})
