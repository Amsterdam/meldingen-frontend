import type { Mock } from 'vitest'

import { COOKIES, TOP_ANCHOR_ID } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockIdAndTokenCookies } from '~/mocks/utils'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import { postSummaryForm } from './actions'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const defaultArgs = {
  created_at: '2024-01-01T00:00:00Z',
  public_id: 'abc123',
}

describe('postSummaryForm', () => {
  it('should redirect to /cookie-storing if meldingId or token is missing', async () => {
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    await postSummaryForm(defaultArgs)

    expect(redirect).toHaveBeenCalledWith(`/cookie-storing#${TOP_ANCHOR_ID}`)
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    mockIdAndTokenCookies()

    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_MELDER, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const result = await postSummaryForm(defaultArgs)

    expect(result).toEqual({ systemError: 'Error message' })
  })

  it('deletes all cookies and redirects to /bedankt', async () => {
    const deleteMock = vi.fn()

    ;(cookies as Mock).mockReturnValue({
      delete: deleteMock,
      get: (name: string) => {
        if (name === COOKIES.ID) {
          return { value: '123' }
        }
        if (name === COOKIES.TOKEN) {
          return { value: 'test-token' }
        }
        return undefined
      },
    })

    await postSummaryForm(defaultArgs)

    Object.values(COOKIES).forEach((cookieName) => {
      expect(deleteMock).toHaveBeenCalledWith(cookieName)
    })

    expect(redirect).toHaveBeenCalledWith(
      `/bedankt?created_at=${encodeURIComponent(defaultArgs.created_at)}&public_id=${defaultArgs.public_id}#${TOP_ANCHOR_ID}`,
    )
  })

  it('includes source and id query params in redirect URL if source cookie is present', async () => {
    const deleteMock = vi.fn()

    ;(cookies as Mock).mockReturnValue({
      delete: deleteMock,
      get: (name: string) => {
        if (name === COOKIES.ID) {
          return { value: '123' }
        }
        if (name === COOKIES.TOKEN) {
          return { value: 'test-token' }
        }
        if (name === COOKIES.SOURCE) {
          return { value: 'test-source' }
        }
        return undefined
      },
    })

    await postSummaryForm(defaultArgs)

    expect(redirect).toHaveBeenCalledWith(
      `/bedankt?created_at=${encodeURIComponent(defaultArgs.created_at)}&public_id=${defaultArgs.public_id}&id=123&source=test-source#${TOP_ANCHOR_ID}`,
    )
  })
})
