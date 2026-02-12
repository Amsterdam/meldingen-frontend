import { render, screen } from '@testing-library/react'

import { CancelLink } from './CancelLink'

describe('CancelLink', () => {
  it('renders a link with the given href', () => {
    render(<CancelLink href="#" />)

    const component = screen.getByRole('link')

    expect(component).toHaveAttribute('href', '#')
  })
})
