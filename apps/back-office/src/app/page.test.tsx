import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import { COOKIES } from '../constants'
import { meldingen } from '../mocks/data'
import { ENDPOINTS } from '../mocks/endpoints'
import { server } from '../mocks/node'
import { mockCookies } from '../mocks/utils'
import { Overview } from './Overview'
import Page, { generateMetadata } from './page'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./Overview', () => ({
  Overview: vi.fn(() => <div>Overview Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  beforeAll(() => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue(undefined),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)
  })

  it('renders the Overview component without a "pagina" search param', async () => {
    const searchParams = Promise.resolve({})

    const result = await Page({ searchParams })

    render(result)

    expect(Overview).toHaveBeenCalledWith(
      {
        meldingen: meldingen,
        meldingenCount: 40,
        page: undefined,
        pageSize: 10,
        totalPages: 4,
      },
      undefined,
    )
  })

  it('renders the Overview component with a "pagina" search param', async () => {
    const searchParams = Promise.resolve({ pagina: '2' })

    const result = await Page({ searchParams })

    render(result)

    expect(Overview).toHaveBeenCalledWith(
      {
        meldingen: meldingen,
        meldingenCount: 40,
        page: 2,
        pageSize: 10,
        totalPages: 4,
      },
      undefined,
    )
  })

  it('uses the page size cookie when present and valid', async () => {
    mockCookies({
      [COOKIES.PAGE_SIZE]: '20',
    })
    const searchParams = Promise.resolve({})

    const result = await Page({ searchParams })

    render(result)

    expect(Overview).toHaveBeenCalledWith(
      {
        meldingen: meldingen,
        meldingenCount: 40,
        page: undefined,
        pageSize: 20,
        totalPages: 2,
      },
      undefined,
    )
  })

  it('redirects to the homepage if the page parameter is invalid', async () => {
    const searchParams = Promise.resolve({ pagina: 'invalid' })

    await Page({ searchParams })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('redirects to the homepage if the page exceeds total pages', async () => {
    const searchParams = Promise.resolve({ pagina: '5' })

    await Page({ searchParams })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('shows a message on API error', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })))

    const searchParams = Promise.resolve({ pagina: '1' })

    const result = await Page({ searchParams })

    render(result)

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
