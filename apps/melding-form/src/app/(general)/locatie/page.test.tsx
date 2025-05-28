import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import { Location } from './Location'
import Page from './page'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('./Location', () => ({
  Location: vi.fn(() => <div>Location Component</div>),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders Location component with default props when cookies are not set', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith({ prevPage: '/', locationData: undefined }, {})
  })

  it('renders Location component with props from cookies', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'lastPanelPath') {
        return { value: '/previous' }
      }
      if (name === 'location') {
        return { value: JSON.stringify({ lat: 52.370216, lng: 4.895168 }) }
      }
      return undefined
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Location Component')).toBeInTheDocument()
    expect(Location).toHaveBeenCalledWith(
      { prevPage: '/previous', locationData: { lat: 52.370216, lng: 4.895168 } },
      {},
    )
  })
})
