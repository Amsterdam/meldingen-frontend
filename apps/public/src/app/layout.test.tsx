import { render } from '@testing-library/react'

import Layout from './layout'

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockReturnValue('nl'),
  getMessages: vi.fn().mockReturnValue({}),
}))

describe('Layout', () => {
  it('should render', () => {
    const { container } = render(<Layout>Test</Layout>)

    const outerWrapper = container.querySelector('html')
    const body = container.querySelector('body')

    expect(outerWrapper).toHaveAttribute('lang', 'nl')
    expect(body).toBeInTheDocument()
  })
})
