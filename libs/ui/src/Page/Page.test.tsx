import { render } from '@testing-library/react'

import { Page } from './Page'

describe('Page', () => {
  it('renders', () => {
    const { container } = render(<Page />)

    const component = container.querySelector(':only-child')

    expect(component).toBeInTheDocument()
  })

  it('adds ‘js-enabled’ class to body on mount', () => {
    render(<Page />)

    expect(document.body.classList.contains('js-enabled')).toBe(true)
  })
})
