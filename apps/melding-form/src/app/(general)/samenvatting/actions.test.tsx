import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { postSummaryForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postSummaryForm', () => {
  const mockCookies = {
    get: vi.fn(),
    delete: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('should redirect to /cookie-storing if meldingId or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    await postSummaryForm()

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT, () =>
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

    const result = await postSummaryForm()

    expect(result).toEqual({ message: 'Error message' })
  })

  it('deletes location, token, lastPanelPath and id cookies and redirects to /bedankt', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    await postSummaryForm()

    expect(mockCookies.delete).toHaveBeenCalledWith('location')
    expect(mockCookies.delete).toHaveBeenCalledWith('token')
    expect(mockCookies.delete).toHaveBeenCalledWith('lastPanelPath')
    expect(mockCookies.delete).toHaveBeenCalledWith('id')
    expect(redirect).toHaveBeenCalledWith('/bedankt')
  })
})
