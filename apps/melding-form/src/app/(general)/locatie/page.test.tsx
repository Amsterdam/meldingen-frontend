import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import { Location } from './Location'
import Page from './page'
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
    expect(Location).toHaveBeenCalledWith({ prevPage: '/', locationData: undefined }, {})
  })

  it('renders Location component with props from cookies', async () => {
    mockCookies({ lastPanelPath: '/previous', location: JSON.stringify({ lat: 52.370216, lng: 4.895168 }) })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith(
      { prevPage: '/previous', locationData: { lat: 52.370216, lng: 4.895168 } },
      {},
    )
  })
})
