import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import { Locatie } from './Locatie'
import Page from './page'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('./Locatie', () => ({
  Locatie: vi.fn(() => <div>Locatie Component</div>),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders Locatie component with default props when cookies are not set', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Locatie Component')).toBeInTheDocument()
    expect(Locatie).toHaveBeenCalledWith({ prevPage: '/', locationData: undefined }, {})
  })

  it('renders Locatie component with props from cookies', async () => {
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

    expect(screen.getByText('Locatie Component')).toBeInTheDocument()
    expect(Locatie).toHaveBeenCalledWith({ prevPage: '/previous', locationData: { lat: 52.370216, lng: 4.895168 } }, {})
  })
})
