import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { expect, vi } from 'vitest'

import { GET } from './route'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'
import { server } from '~/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

const BASE_URL = 'http://localhost:3000'
// NOTE: A deviation from the BASE_URL used in the application, for testing purposes we define it explicitly here.
// As the tual integrated GET call is targeted to localhost:8000, ENDPOINTS cannot be used here
const BACKEND_BASE_URL = 'http://localhost:8000'

const createRequest = (params: Record<string, string>) => {
  const url = new URL('/back-office-entry', 'http://not-url-from-env-var.com')
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  return new NextRequest(url)
}

const requiredParams = {
  id: '123',
  token: 'test-token',
}

describe('GET', () => {
  let mockCookieStore: { delete: Mock; set: Mock }

  beforeEach(() => {
    mockCookieStore = { delete: vi.fn(), set: vi.fn() }
    ;(cookies as Mock).mockReturnValue(mockCookieStore)
  })

  it('redirects to Home when id or token is missing', async () => {
    const { id: _id, ...params } = requiredParams
    const response = await GET(createRequest(params))
    expect(response.headers.get('location')).toBe(`${BASE_URL}/`)

    const { token: _token, ...params2 } = requiredParams
    const response2 = await GET(createRequest(params2))
    expect(response2.headers.get('location')).toBe(`${BASE_URL}/`)
  })

  it('sets cookies with correct values and maxAge', async () => {
    await GET(createRequest(requiredParams))

    const oneDay = 24 * 60 * 60
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.ID, '123', { maxAge: oneDay })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'test-token', { maxAge: oneDay })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.SOURCE, 'back-office', { maxAge: oneDay })
  })

  it('deletes LAST_PANEL_PATH cookie', async () => {
    await GET(createRequest(requiredParams))

    expect(mockCookieStore.delete).toHaveBeenCalledWith(COOKIES.LAST_PANEL_PATH)
  })

  it('redirects to Home and logs error when an API error occurs', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get(`${BACKEND_BASE_URL}/form/classification/:id`, () => HttpResponse.json('API error', { status: 500 })),
    )

    const response = await GET(createRequest({ ...requiredParams, classification_id: '42' }))

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(response.headers.get('location')).toBe(`${BASE_URL}/`)
  })

  it('redirects to the correct URL when GET is successful', async () => {
    server.use(
      http.get(`${BACKEND_BASE_URL}/form/classification/:id`, () => HttpResponse.json({ components: [] })),
      http.put(`${BACKEND_BASE_URL}/melding/:id/answer_questions`, () => HttpResponse.json({}, { status: 200 })),
    )

    const response = await GET(
      createRequest({
        classification_id: '42',
        ...requiredParams,
      }),
    )

    expect(response.headers.get('location')).toBe(`${BASE_URL}/locatie#${TOP_ANCHOR_ID}`)
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.ID, '123', { maxAge: 24 * 60 * 60 })
    expect(mockCookieStore.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'test-token', { maxAge: 24 * 60 * 60 })
    expect(mockCookieStore.delete).toHaveBeenCalledWith(COOKIES.LAST_PANEL_PATH)
  })
})
