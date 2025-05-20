import { render, screen } from '@testing-library/react'

import { ListBox } from './ListBox'

describe('ListBox', () => {
  it('should pass classnames properly', () => {
    render(<ListBox className="extra" />)

    const listElement = screen.getByRole('list')

    expect(listElement).toHaveClass('extra')
  })
})
