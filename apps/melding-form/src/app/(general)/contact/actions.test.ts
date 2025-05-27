import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postContactForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('postContactForm', () => {
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

  it('should redirect to /samenvatting page on success', async () => {
    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('phone', '0612345678')

    await postContactForm(undefined, formData)

    expect(redirect).toHaveBeenCalledWith('/samenvatting')
  })

  it('should redirect to /samenvatting page when email and phone are left empty', async () => {
    const formData = new FormData()

    await postContactForm(undefined, formData)

    expect(redirect).toHaveBeenCalledWith('/samenvatting')
  })

  it('should return undefined when there is no meldingId or token', async () => {
    // Override cookies mock for this specific test
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('phone', '0612345678')

    const result = await postContactForm(undefined, formData)

    expect(result).toBeUndefined()
  })

  it('returns an error message if an error occurs', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_CONTACT, () => new HttpResponse(null, { status: 404 })))

    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('phone', '0612345678')

    const result = await postContactForm(null, formData)

    expect(result).toEqual({ message: 'An unknown error occurred' })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_CONTACT_INFO, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    const result = await postContactForm(null, formData)

    expect(result).toEqual({ message: 'Error message' })
  })
})
