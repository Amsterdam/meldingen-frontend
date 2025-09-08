import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page, { generateMetadata } from './page'
import { SelectLocation } from './SelectLocation'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

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

  it('throws an error when melding data cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch melding data.')
  })

  it('does not pass coordinates to SelectLocation when location cookie is absent', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        coordinates: undefined,
      }),
      {},
    )
  })

  it('passes coordinates to SelectLocation when location cookie is present', async () => {
    ;(cookies as Mock).mockReturnValue({
      get: (name: string) => {
        if (name === 'id') return { value: '123' }
        if (name === 'token') return { value: 'test-token' }
        if (name === 'location')
          return { value: JSON.stringify({ name: 'Test Location', coordinates: { lat: 52.370216, lng: 4.895168 } }) }
        return undefined
      },
      set: vi.fn(),
    })

    const PageComponent = await Page()
    render(PageComponent)

    expect(SelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        coordinates: { lat: 52.370216, lng: 4.895168 },
      }),
      {},
    )
  })
})
