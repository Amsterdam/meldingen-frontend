import { render } from '@testing-library/react'

import { SummaryListTerm } from './SummaryListTerm'

describe('SummaryListTerm', () => {
  it('renders an extra class name', () => {
    const { container } = render(<SummaryListTerm className="extra" />)

    const element = container.querySelector('dt')

    expect(element).toHaveClass('_term_0baf87 extra')
  })
})
