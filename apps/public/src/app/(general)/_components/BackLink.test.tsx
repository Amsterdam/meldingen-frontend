import { render, screen } from '@testing-library/react'

import { BackLink } from './BackLink'

describe('BackLink', () => {
  it('renders an extra class name', () => {
    render(<BackLink className="extra" href="#" />)

    const component = screen.getByRole('link')

    expect(component).toHaveClass(/link/)
    expect(component).toHaveClass('extra')
  })
})
