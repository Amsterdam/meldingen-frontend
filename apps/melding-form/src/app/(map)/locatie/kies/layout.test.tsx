import { render } from '@testing-library/react'

import Layout from './layout'

describe('Layout', () => {
  it('should render', () => {
    const { container } = render(<Layout>Test</Layout>)

    const main = container.querySelector('main')

    expect(main).toBeInTheDocument()
  })
})
