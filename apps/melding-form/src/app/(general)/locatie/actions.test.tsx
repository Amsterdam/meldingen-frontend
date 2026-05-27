import type { Mock } from 'vitest'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postLocationForm } from './actions'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'
import { mockCookies, mockIdAndTokenCookies } from '~/mocks/utils'

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

    expect(redirect).toHaveBeenCalledWith(`/cookie-storing#${TOP_ANCHOR_ID}`)
  })

  it('returns a validation error when address is missing', async () => {
    const result = await postLocationForm()

    expect(result).toEqual({ validationErrors: [{ key: 'location-link', message: 'errors.no-location' }] })
  })

  it('redirects to /bijlage when the form is submitted successfully', async () => {
    mockCookies({
      [COOKIES.ADDRESS]: 'Oudezijds Voorburgwal 300, 1012GL Amsterdam',
      [COOKIES.ID]: '123',
      [COOKIES.TOKEN]: 'test-token',
    })

    await postLocationForm()

    expect(redirect).toHaveBeenCalledWith(`/bijlage#${TOP_ANCHOR_ID}`)
  })
})
