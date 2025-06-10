import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page, { generateMetadata } from './page'

vi.mock('./Attachments', () => ({
  Attachments: vi.fn(() => <div>Attachments Component</div>),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  beforeEach(() => {
    // Default mock for cookies
    ;(cookies as Mock).mockReturnValue({
      get: (name: string) => {
        if (name === 'id') {
          return { value: '123' }
        }
        if (name === 'token') {
          return { value: 'test-token' }
        }
        return undefined
      },
    })
  })

  it('renders the Attachments component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Attachments Component')).toBeInTheDocument()
  })
})
