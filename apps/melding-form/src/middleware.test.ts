import { NextRequest, NextResponse } from 'next/server'

import { COOKIES } from './constants'
import { proxy } from './proxy'

vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    NextResponse: {
      redirect: vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() })),
      next: vi.fn(() => ({ type: 'next' })),
    },
  }
})

const createMockRequest = (cookies: Record<string, string>, url = 'http://localhost/'): NextRequest =>
  ({
    cookies: {
      get: (key: string) => (cookies[key] ? { value: cookies[key] } : undefined),
    },
    url,
  }) as NextRequest

describe('proxy', () => {
  it('redirects to / if token is missing', () => {
    const request = createMockRequest({ [COOKIES.ID]: '123' })
    const result = proxy(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/', request.url))
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost/' })
  })

  it('redirects to / if id is missing', () => {
    const request = createMockRequest({ [COOKIES.TOKEN]: 'abc' })
    const result = proxy(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/', request.url))
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost/' })
  })

  it('calls NextResponse.next if both token and id are present', () => {
    const request = createMockRequest({ [COOKIES.TOKEN]: 'abc', [COOKIES.ID]: '123' })
    const result = proxy(request)

    expect(NextResponse.next).toHaveBeenCalled()
    expect(result).toEqual({ type: 'next' })
  })
})
