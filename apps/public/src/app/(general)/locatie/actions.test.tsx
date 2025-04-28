import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postLocationForm } from './actions'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postLocationForm', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns undefined when id or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const formData = new FormData()
    const result = await postLocationForm(null, formData)

    expect(result).toBeUndefined()
  })

  it('returns an error when coordinates are missing', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    const formData = new FormData()
    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ message: 'errors.no-location' })
  })

  it('posts the location and redirects to /bijlage', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    const formData = new FormData()
    formData.set('coordinates', '{"lat":52.370216,"lng":4.895168}')

    await postLocationForm(null, formData)

    expect(redirect).toHaveBeenCalledWith('/bijlage')
  })

  it('returns an error message if postMeldingByMeldingIdLocation returns an error', async () => {
    server.use(http.post(ENDPOINTS.MELDING_LOCATION_BY_ID, () => new HttpResponse(null, { status: 404 })))

    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    const formData = new FormData()
    formData.set('coordinates', '{"lat":52.370216,"lng":4.895168}')

    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ message: 'An unknown error occurred' })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.MELDING_BY_ID_SUBMIT_LOCATION, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    const formData = new FormData()
    formData.set('coordinates', '{"lat":52.370216,"lng":4.895168}')

    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ message: 'Error message' })
  })
})
