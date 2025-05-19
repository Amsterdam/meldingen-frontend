import { render } from '@testing-library/react'

import { SummaryListItem } from './SummaryListItem'

describe('SummaryListItem', () => {
  it('renders an extra class name', () => {
    const { container } = render(<SummaryListItem className="extra" />)

    const element = container.querySelector('div')

    expect(element).toHaveClass('_item_0baf87 extra')
  })
})
