import { render, screen } from '@testing-library/react'

import { BackLink } from './BackLink'

describe('BackLink', () => {
  it('renders a link with the given href', () => {
    render(<BackLink href="#" />)

    const component = screen.getByRole('link')

    expect(component).toHaveAttribute('href', '#')
  })
})
