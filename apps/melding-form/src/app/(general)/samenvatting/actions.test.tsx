import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { postSummaryForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postSummaryForm', () => {
  it('should redirect to /cookie-storing if meldingId or token is missing', async () => {
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    await postSummaryForm()

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    mockIdAndTokenCookies()

    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT, () => HttpResponse.json('Error message', { status: 500 })),
    )

    const result = await postSummaryForm()

    expect(result).toEqual({ systemError: 'Error message' })
  })

  it('deletes address, token, lastPanelPath and id cookies and redirects to /bedankt', async () => {
    const deleteMock = vi.fn()

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
      delete: deleteMock,
    })

    await postSummaryForm()

    expect(deleteMock).toHaveBeenCalledWith('address')
    expect(deleteMock).toHaveBeenCalledWith('token')
    expect(deleteMock).toHaveBeenCalledWith('lastPanelPath')
    expect(deleteMock).toHaveBeenCalledWith('id')
    expect(redirect).toHaveBeenCalledWith('/bedankt')
  })
})
