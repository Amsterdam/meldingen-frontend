import { render } from '@testing-library/react'

import { SummaryListDescription } from './SummaryListDescription'

describe('SummaryListDescription', () => {
  it('renders an extra class name', () => {
    const { container } = render(<SummaryListDescription className="extra" />)

    const element = container.querySelector('dd')

    expect(element).toHaveClass('_description_0baf87 extra')
  })
})
