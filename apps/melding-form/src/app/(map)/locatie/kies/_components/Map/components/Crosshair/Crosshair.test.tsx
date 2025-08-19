import { render } from '@testing-library/react'

import { Crosshair } from './Crosshair'

describe('Crosshair', () => {
  it('renders a div with the crosshair class', () => {
    const { container } = render(<Crosshair />)
    const component = container.querySelector('div')

    expect(component).toBeInTheDocument()
    expect(component).toHaveClass(/crosshair/)
  })

  it('renders an SVG', () => {
    const { container } = render(<Crosshair />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('forwards extra props to the div', () => {
    const { container } = render(<Crosshair aria-label="crosshair" />)

    const component = container.querySelector('div')
    expect(component).toHaveAttribute('aria-label', 'crosshair')
  })
})
