import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postLocationForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postLocationForm', () => {
  beforeEach(() => {
    // Default mock for cookies
    ;(cookies as Mock).mockReturnValue({
      get: (name: string) => {
        if (name === 'id') {
          return { value: '123' }
        }
        if (name === 'token') {
          return { value: 'test-token' }
        }
        return undefined
      },
    })
  })

  it('redirects to /cookie-storing when id or token is missing', async () => {
    // Override cookies mock for this specific test
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    const formData = new FormData()
    await postLocationForm(null, formData)

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('returns an error when coordinates are missing', async () => {
    const formData = new FormData()
    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ errorMessage: 'errors.no-location' })
  })

  it('posts the location and redirects to /bijlage', async () => {
    const formData = new FormData()
    formData.set('coordinates', '{"lat":52.370216,"lng":4.895168}')

    await postLocationForm(null, formData)

    expect(redirect).toHaveBeenCalledWith('/bijlage')
  })

  it('returns an error message if postMeldingByMeldingIdLocation returns an error', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_LOCATION, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 404 }),
      ),
    )

    const formData = new FormData()
    formData.set('coordinates', '{"lat":52.370216,"lng":4.895168}')

    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ errorMessage: 'Error message' })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_LOCATION, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.set('coordinates', '{"lat":52.370216,"lng":4.895168}')

    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ errorMessage: 'Error message' })
  })
})
