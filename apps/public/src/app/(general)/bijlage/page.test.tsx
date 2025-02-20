import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page from './page'

vi.mock('./Bijlage', () => ({
  Bijlage: vi.fn(() => <div>Bijlage Component</div>),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders the Bijlage component', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '21' }
      }
      if (name === 'token') {
        return { value: 'z123890' }
      }
      return undefined
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Bijlage Component')).toBeInTheDocument()
  })

  it('should render undefined when there is no meldingId or token', async () => {
    mockCookies.get.mockImplementation(() => {})

    const PageComponent = await Page()

    render(PageComponent)
  })
})
