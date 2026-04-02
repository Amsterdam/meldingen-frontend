import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { vi } from 'vitest'

import { GET } from './route'
import { COOKIES, TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

const BASE_URL = 'http://localhost:3000'

const createRequest = (params: Record<string, string>) => {
  const url = new URL('/back-office-entry', BASE_URL)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  return new NextRequest(url)
}

const requiredParams = {
  created_at: '2025-01-01T00:00:00Z',
  id: '123',
  public_id: 'B100AA',
  token: 'test-token',
}

describe('GET', () => {
  const mockCookieStore = { set: vi.fn() }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookieStore)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to / when id, token, created_at, or public_id is missing', async () => {
    const { id: _id, ...params } = requiredParams
    const response = await GET(createRequest(params))
    expect(response.headers.get('location')).toBe(`${BASE_URL}/`)

    const { token: _token, ...params2 } = requiredParams
    const response2 = await GET(createRequest(params2))
    expect(response2.headers.get('location')).toBe(`${BASE_URL}/`)

    const { created_at: _created_at, ...params3 } = requiredParams
    const response3 = await GET(createRequest(params3))
    expect(response3.headers.get('location')).toBe(`${BASE_URL}/`)

    const { public_id: _public_id, ...params4 } = requiredParams
    const response4 = await GET(createRequest(params4))
    expect(response4.headers.get('location')).toBe(`${BASE_URL}/`)
  })

  it('sets cookies with correct values and maxAge', async () => {
    await GET(createRequest(requiredParams))

    const oneDay = 24 * 60 * 60
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.ID, '123', { maxAge: oneDay })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'test-token', { maxAge: oneDay })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.CREATED_AT, '2025-01-01T00:00:00Z', { maxAge: oneDay })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.PUBLIC_ID, 'B100AA', { maxAge: oneDay })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.SOURCE, 'back-office', { maxAge: oneDay })
  })

  it('redirects to / and logs error when an API error occurs', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json('API error', { status: 500 }),
      ),
    )

    const response = await GET(createRequest({ ...requiredParams, classification_id: '42' }))

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(response.headers.get('location')).toBe(`${BASE_URL}/`)
  })

  it('redirects to the correct URL when GET is successful', async () => {
    const response = await GET(createRequest({ ...requiredParams, classification_id: '42' }))

    expect(response.headers.get('location')).toBe(`${BASE_URL}/locatie#${TOP_ANCHOR_ID}`)
  })
})
