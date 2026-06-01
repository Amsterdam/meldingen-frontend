import { render } from '@testing-library/react'

import Layout from './layout'

describe('Layout', () => {
  it('should render', () => {
    const { container } = render(<Layout>Test</Layout>)

    const header = container.querySelector('header')
    const footer = container.querySelector('footer')

    expect(header).toBeInTheDocument()
    expect(footer).toBeInTheDocument()
  })
})
