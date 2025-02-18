import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'

import Page from './page'
import { Mock } from 'vitest'

vi.mock('./Bijlage', () => ({
  Bijlage: vi.fn(() => <div>Bijlage Component</div>),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi
      .fn()
      .mockImplementationOnce(() => ({ name: 'id', value: '1234' }))
      .mockImplementationOnce(() => ({ name: 'token', value: 'mock-token' }))
      .mockImplementation(() => {}),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders the Bijlage component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Bijlage Component')).toBeInTheDocument()
  })

  it('should render undefined when there is no meldingId or token', async () => {
    const PageComponent = await Page()

    render(PageComponent)
  })
})
