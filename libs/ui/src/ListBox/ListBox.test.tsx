import { render, screen } from '@testing-library/react'

import { ListBox } from './ListBox'

describe('ListBox', () => {
  it('should pass classnames properly', () => {
    const { rerender } = render(<ListBox />)

    const ul = screen.getByRole('list')

    expect(ul).toHaveClass('_list_c59894')

    rerender(<ListBox className="test-123" />)

    const ulSecondRender = screen.getByRole('list')

    expect(ulSecondRender).toHaveClass('_list_c59894 test-123')
  })
})
