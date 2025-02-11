import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Page from './page'

vi.mock('./Contact', () => ({
  Contact: vi.fn(() => <div>Contact Component</div>),
}))

describe('Page', () => {
  it('renders the Contact component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Contact Component')).toBeInTheDocument()
  })
})
