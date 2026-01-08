import { render } from '@testing-library/react'

import { StandaloneLink } from './StandaloneLink'

describe('StandaloneLink', () => {
  it('renders', () => {
    const { container } = render(<StandaloneLink />)

    const component = container.querySelector(':only-child')

    expect(component).toBeInTheDocument()
  })
})
