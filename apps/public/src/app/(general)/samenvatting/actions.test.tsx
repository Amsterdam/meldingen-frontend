import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { postSummaryForm } from './actions'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

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
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns undefined if meldingId or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const result = await postSummaryForm()

    expect(result).toBeUndefined()
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.MELDING_BY_ID_SUBMIT, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
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

  it('deletes location, token, and lastPanelPath cookies and redirects to /bedankt', async () => {
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
    expect(redirect).toHaveBeenCalledWith('/bedankt')
  })
})
