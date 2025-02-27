import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import Page from './page'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('./Thanks', () => ({
  Thanks: vi.fn(() => <div>Thanks Component</div>),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns undefined when there is no meldingId', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const PageComponent = await Page()

    render(PageComponent)

    expect(PageComponent).toBeUndefined()
  })

  it('renders Thanks page', async () => {
    mockCookies.get.mockReturnValue({ value: '1234' })

    const PageComponent = await Page()

    render(PageComponent)

    expect(redirect).not.toHaveBeenCalledWith('/')
    expect(screen.getByText('Thanks Component')).toBeInTheDocument()
  })
})
