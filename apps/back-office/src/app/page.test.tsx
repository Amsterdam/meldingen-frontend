import { render } from '@testing-library/react'
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
import Page from './page'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./Overview', () => ({
  Overview: vi.fn(() => <div>Overview Component</div>),
}))

describe('Page', () => {
  beforeAll(() => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>

    vi.mocked(cookies).mockResolvedValue(mockCookieStore)
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

  it('throws an error when there is an API error', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })))

    const searchParams = Promise.resolve({ pagina: '1' })

    await expect(Page({ searchParams })).rejects.toThrow('Failed to fetch meldingen.')
  })

  it('throws an error when the Content-Range header is missing', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING, () => HttpResponse.json(meldingen)))

    const searchParams = Promise.resolve({ pagina: '1' })

    await expect(Page({ searchParams })).rejects.toThrow('Missing Content-Range header for meldingen overview.')
  })
})
