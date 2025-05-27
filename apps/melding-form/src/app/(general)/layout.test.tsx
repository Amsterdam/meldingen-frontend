import { render } from '@testing-library/react'

import Layout from './layout'

// We have to mock matchMedia here, because it is used in the Amsterdam Design System Header component
// We do not really use the matchMedia functionality, so we use a simple mock.
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({})),
})

describe('Layout', () => {
  it('should render', () => {
    const { container } = render(<Layout>Test</Layout>)

    const header = container.querySelector('header')
    const main = container.querySelector('main')
    const footer = container.querySelector('footer')

    expect(header).toBeInTheDocument()
    expect(main).toBeInTheDocument()
    expect(footer).toBeInTheDocument()
  })
})
