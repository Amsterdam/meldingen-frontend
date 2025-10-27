import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import { Location } from './Location'
import Page from './page'
import { COOKIES } from 'apps/melding-form/src/constants'
import { mockCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./Location', () => ({
  Location: vi.fn(() => <div>Location Component</div>),
}))

describe('Page', () => {
  it('renders Location component with default props when cookies are not set', async () => {
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith({ prevPage: '/', address: undefined }, undefined)
  })

  it('renders Location component with props from cookies', async () => {
    mockCookies({
      [COOKIES.LAST_PANEL_PATH]: '/previous',
      [COOKIES.ADDRESS]: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam',
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith(
      { prevPage: '/previous', address: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam' },
      undefined,
    )
  })
})
