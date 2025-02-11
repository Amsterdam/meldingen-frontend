import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Page from './page'

vi.mock('./Bijlage', () => ({
  Bijlage: vi.fn(() => <div>Bijlage Component</div>),
}))

describe('Page', () => {
  it('renders the Bijlage component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Bijlage Component')).toBeInTheDocument()
  })
})
