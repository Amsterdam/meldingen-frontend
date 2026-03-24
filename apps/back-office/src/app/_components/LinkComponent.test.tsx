import { render, screen } from '@testing-library/react'

import { LinkComponent } from './LinkComponent'

describe('LinkComponent', () => {
  it('renders children as a link', () => {
    render(<LinkComponent href="/test">Test</LinkComponent>)

    const link = screen.getByRole('link', { name: 'Test' })
    expect(link).toHaveAttribute('href', '/test')
  })

  it('falls back to "/" when no href is provided', () => {
    render(<LinkComponent>Test</LinkComponent>)

    const link = screen.getByRole('link', { name: 'Test' })
    expect(link).toHaveAttribute('href', '/')
  })
})
