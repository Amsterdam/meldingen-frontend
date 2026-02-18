import { render, screen } from '@testing-library/react'

import { Header } from './Header'

describe('Header', () => {
  it('renders', () => {
    render(<Header />)

    const header = screen.getByRole('banner')

    expect(header).toBeInTheDocument()
  })
})
