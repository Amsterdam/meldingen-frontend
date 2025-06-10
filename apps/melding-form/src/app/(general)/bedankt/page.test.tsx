import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import Page, { generateMetadata } from './page'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('./utils', () => ({
  getDescription: vi.fn(() => 'description'),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders page', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'public_id') {
        return { value: '1234' }
      }
      if (name === 'created_at') {
        return { value: '2025-05-26T11:56:34.081Z' }
      }
      return undefined
    })

    const PageComponent = await Page()

    render(PageComponent)

    const heading = screen.getByRole('heading', { name: 'title' })
    const paragraph = screen.getByText('description')
    const link = screen.getByRole('link', { name: 'link' })

    expect(redirect).not.toHaveBeenCalledWith('/')
    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })
})
