import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { submitAttachmentsForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('submitAttachmentsForm', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('redirects to /cookie-storing when id or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    await submitAttachmentsForm()

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_ATTACHMENTS, () =>
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

    const result = await submitAttachmentsForm()

    expect(result).toEqual({ message: 'Error message' })
  })

  it('redirects to /contact page on success', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    await submitAttachmentsForm()

    expect(redirect).toHaveBeenCalledWith('/contact')
  })
})
