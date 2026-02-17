import { render } from '@testing-library/react'

import { Link } from './Link'

describe('Link', () => {
  it('renders', () => {
    const { container } = render(<Link />)

    const component = container.querySelector(':only-child')

    expect(component).toBeInTheDocument()
  })
})
