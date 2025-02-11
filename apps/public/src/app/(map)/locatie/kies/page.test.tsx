import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Page from './page'

vi.mock('./KiesLocatie', () => ({
  KiesLocatie: vi.fn(() => <div>KiesLocatie Component</div>),
}))

describe('Page', () => {
  it('renders the KiesLocatie component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('KiesLocatie Component')).toBeInTheDocument()
  })
})
