import { render, screen } from '@testing-library/react'

import { ListBox } from './ListBox'

describe('ListBox', () => {
  it('should pass classnames properly', () => {
    const { rerender } = render(<ListBox className={undefined} />)

    const ul = screen.getByRole('list')

    expect(ul).not.toHaveClass('undefined')

    rerender(<ListBox className="test-123" />)

    const ulSecondRender = screen.getByRole('list')

    expect(ulSecondRender).toHaveClass('test-123')
  })
})
