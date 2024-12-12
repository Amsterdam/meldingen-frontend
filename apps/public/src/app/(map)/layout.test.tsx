import { render } from '@testing-library/react'

import Layout from './layout'

describe('Layout', () => {
  it('should render', () => {
    const { container } = render(<Layout>Test</Layout>)

    const outerWrapper = container.querySelector('html')
    const body = container.querySelector('body')
    const main = container.querySelector('main')

    expect(outerWrapper).toHaveAttribute('lang', 'nl')
    expect(body).toBeInTheDocument()
    expect(main).toBeInTheDocument()
  })
})
