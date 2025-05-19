import { render } from '@testing-library/react'

import { SummaryList } from './SummaryList'

describe('SummaryList', () => {
  it('renders an extra class name', () => {
    const { container } = render(<SummaryList className="extra" />)

    const element = container.querySelector('dl')

    expect(element).toHaveClass(/list/)
    expect(element).toHaveClass('extra')
  })
})
