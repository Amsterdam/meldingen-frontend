import { render } from '@testing-library/react'

import { BaseLayer } from './BaseLayer'

describe('BaseLayer', () => {
  it('renders the component', () => {
    const { container } = render(<BaseLayer setCoordinates={() => {}} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

// TODO: add tests
