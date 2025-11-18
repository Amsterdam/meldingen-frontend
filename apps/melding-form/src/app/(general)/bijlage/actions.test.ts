import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { submitAttachmentsForm } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('submitAttachmentsForm', () => {
  it('redirects to /cookie-storing when id or token is missing', async () => {
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    await submitAttachmentsForm()

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    mockIdAndTokenCookies()

    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_ATTACHMENTS, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const result = await submitAttachmentsForm()

    expect(result).toEqual({ systemError: 'Error message' })
  })

  it('redirects to /contact page on success', async () => {
    mockIdAndTokenCookies()

    await submitAttachmentsForm()

    expect(redirect).toHaveBeenCalledWith('/contact')
  })
})
