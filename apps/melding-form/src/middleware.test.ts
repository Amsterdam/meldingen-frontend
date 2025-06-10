import { NextRequest, NextResponse } from 'next/server'

import { middleware } from './middleware'

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

const createMockRequest = (cookies: Record<string, string>, url = 'http://localhost/test'): NextRequest =>
  ({
    cookies: {
      get: (key: string) => (cookies[key] ? { value: cookies[key] } : undefined),
    },
    url,
  }) as NextRequest

describe('middleware', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to / if token is missing', () => {
    const request = createMockRequest({ id: '123' })
    const result = middleware(request)
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/', request.url))
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost/' })
  })

  it('redirects to / if id is missing', () => {
    const request = createMockRequest({ token: 'abc' })
    const result = middleware(request)
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/', request.url))
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost/' })
  })

  it('calls NextResponse.next if both token and id are present', () => {
    const request = createMockRequest({ token: 'abc', id: '123' })
    const result = middleware(request)
    expect(NextResponse.next).toHaveBeenCalled()
    expect(result).toEqual({ type: 'next' })
  })
})
