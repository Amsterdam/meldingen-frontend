import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import Page from './page'
import { Thanks } from './Thanks'

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

  it('returns undefined when there is no meldingId or createdAt', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const PageComponent = await Page()

    render(PageComponent)

    expect(PageComponent).toBeUndefined()
  })

  it('renders Thanks page', async () => {
    mockCookies.get.mockReturnValueOnce({ value: '1234' })
    mockCookies.get.mockReturnValueOnce({ value: '2025-05-26T11:56:34.081Z' })

    const PageComponent = await Page()

    render(PageComponent)

    expect(redirect).not.toHaveBeenCalledWith('/')
    expect(screen.getByText('Thanks Component')).toBeInTheDocument()
    expect(Thanks).toHaveBeenCalledWith({ publicId: '1234', date: '26-5-2025', time: '13:56' }, {})
  })
})
