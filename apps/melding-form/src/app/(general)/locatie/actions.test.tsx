import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postLocationForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockCookies, mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postLocationForm', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('redirects to /cookie-storing when id or token is missing', async () => {
    // Override cookies mock for this specific test
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    await postLocationForm()

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('returns a validation error when address is missing', async () => {
    const result = await postLocationForm()

    expect(result).toEqual({ validationErrors: [{ key: 'location-link', message: 'errors.no-location' }] })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_LOCATION, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )
    mockCookies({ id: '123', token: 'test-token', address: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam' })

    const result = await postLocationForm()

    expect(result).toEqual({ systemError: 'Error message' })
  })

  it('redirects to /bijlage when the form is submitted successfully', async () => {
    mockCookies({ id: '123', token: 'test-token', address: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam' })

    await postLocationForm()

    expect(redirect).toHaveBeenCalledWith('/bijlage')
  })
})
