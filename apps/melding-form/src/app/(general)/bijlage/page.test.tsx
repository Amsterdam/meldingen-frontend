import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page from './page'

vi.mock('./Attachments', () => ({
  Attachments: vi.fn(() => <div>Attachments Component</div>),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders the Attachments component', async () => {
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

    expect(screen.getByText('Attachments Component')).toBeInTheDocument()
  })

  it('should render undefined when there is no meldingId or token', async () => {
    mockCookies.get.mockImplementation(() => {})

    const PageComponent = await Page()

    render(PageComponent)

    expect(PageComponent).toBeUndefined()
  })
})
