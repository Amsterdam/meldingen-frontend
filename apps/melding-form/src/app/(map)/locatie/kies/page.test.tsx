import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page, { generateMetadata } from './page'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('./SelectLocation', () => ({
  SelectLocation: vi.fn(() => <div>SelectLocation Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  const mockCookies = (id?: string, token?: string) => {
    ;(cookies as Mock).mockReturnValue({
      get: (name: string) => {
        if (name === 'id') return { value: id }
        if (name === 'token') return { value: token }
        return undefined
      },
      set: vi.fn(),
    })
  }

  beforeEach(() => {
    mockCookies('123', 'test-token') // Default mock for cookies
  })

  it('renders the SelectLocation component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('SelectLocation Component')).toBeInTheDocument()
  })
})
