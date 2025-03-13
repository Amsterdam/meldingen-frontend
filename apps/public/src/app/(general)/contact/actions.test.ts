import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postMeldingByMeldingIdContact } from 'apps/public/src/apiClientProxy'

import { postContactForm } from './actions'

vi.mock('apps/public/src/apiClientProxy', () => ({
  postMeldingByMeldingIdContact: vi.fn(),
}))

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

  it('should post contact details to backend and redirect to /samenvatting page', async () => {
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

    expect(postMeldingByMeldingIdContact).toHaveBeenCalledWith({
      meldingId: 21,
      requestBody: {
        email: 'user@example.com',
        phone: '0612345678',
      },
      token: 'z123890',
    })

    expect(redirect).toHaveBeenCalledWith('/samenvatting')
  })

  it('should not do a query when email and phone are left empty', async () => {
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

    expect(postMeldingByMeldingIdContact).not.toHaveBeenCalled()

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
})
