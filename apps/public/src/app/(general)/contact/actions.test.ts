import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postContactForm } from './actions'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('postContactForm', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('should redirect to /samenvatting page on success', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '21' }
      }
      if (name === 'token') {
        return { value: 'z123890' }
      }
      return undefined
    })

    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('phone', '0612345678')

    await postContactForm(undefined, formData)

    expect(redirect).toHaveBeenCalledWith('/samenvatting')
  })

  it('should redirect to /samenvatting page when email and phone are left empty', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '21' }
      }
      if (name === 'token') {
        return { value: 'z123890' }
      }
      return undefined
    })

    const formData = new FormData()

    await postContactForm(undefined, formData)

    expect(redirect).toHaveBeenCalledWith('/samenvatting')
  })

  it('should return undefined when there is no meldingId or token', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('phone', '0612345678')

    const result = await postContactForm(undefined, formData)

    expect(result).toBeUndefined()
  })

  it('returns an error message if an error occurs', async () => {
    server.use(http.post(ENDPOINTS.MELDING_CONTACT_BY_ID, () => new HttpResponse(null, { status: 404 })))

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
    formData.set('email', 'user@example.com')
    formData.set('phone', '0612345678')

    const result = await postContactForm(null, formData)

    expect(result).toEqual({ message: 'An unknown error occurred' })
  })
})
