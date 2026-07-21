import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postLocationForm } from './actions'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockCookies, mockIdAndTokenCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const formData = new FormData()

describe('postLocationForm', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('redirects to /cookie-storing when id or token is missing', async () => {
    // Override cookies mock for this specific test
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    await postLocationForm(undefined, null, formData)

    expect(redirect).toHaveBeenCalledWith(`/cookie-storing#${TOP_ANCHOR_ID}`)
  })

  it('returns a validation error when address is missing', async () => {
    const result = await postLocationForm(undefined, null, formData)

    expect(result).toEqual({ validationErrors: [{ key: 'location-link', message: 'errors.no-location' }] })
  })

  it('uses the provided requiredError as the validation message when address is missing', async () => {
    const result = await postLocationForm('Custom required error', null, formData)

    expect(result).toEqual({ validationErrors: [{ key: 'location-link', message: 'Custom required error' }] })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_LOCATION, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )
    mockCookies({
      [COOKIES.ADDRESS]: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam',
      [COOKIES.ID]: '123',
      [COOKIES.TOKEN]: 'test-token',
    })

    const result = await postLocationForm(undefined, null, formData)

    expect(result).toEqual({ systemError: 'Error message' })
  })

  it('redirects to /bijlage when the form is submitted successfully', async () => {
    mockCookies({
      [COOKIES.ADDRESS]: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam',
      [COOKIES.ID]: '123',
      [COOKIES.TOKEN]: 'test-token',
    })

    await postLocationForm(undefined, null, formData)

    expect(redirect).toHaveBeenCalledWith(`/bijlage#${TOP_ANCHOR_ID}`)
  })
})
