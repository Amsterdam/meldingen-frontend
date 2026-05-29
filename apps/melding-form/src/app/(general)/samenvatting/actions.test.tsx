import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import { postSummaryForm } from './actions'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockIdAndTokenCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const defaultArgs = {
  created_at: '2024-01-01T00:00:00Z',
  public_id: 'abc123',
  staleAnswerIds: [],
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

  it('deletes every stale answer before submitting the melding', async () => {
    ;(cookies as Mock).mockReturnValue({
      delete: vi.fn(),
      get: (name: string) => {
        if (name === COOKIES.ID) return { value: '123' }
        if (name === COOKIES.TOKEN) return { value: 'test-token' }
        return undefined
      },
    })

    const deletedAnswerIds: string[] = []
    server.use(
      http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ANSWER_BY_ANSWER_ID, ({ params }) => {
        deletedAnswerIds.push(params.answerId as string)
        return new HttpResponse()
      }),
    )

    await postSummaryForm({ ...defaultArgs, staleAnswerIds: [101, 202, 303] })

    expect(deletedAnswerIds).toEqual(expect.arrayContaining(['101', '202', '303']))
    expect(deletedAnswerIds).toHaveLength(3)
  })

  it('returns a systemError and does not submit the melding when deleting a stale answer fails', async () => {
    mockIdAndTokenCookies()

    const submitMock = vi.fn(() => new HttpResponse())
    server.use(
      http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ANSWER_BY_ANSWER_ID, () =>
        HttpResponse.json('Delete failed', { status: 500 }),
      ),
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_MELDER, submitMock),
    )

    const result = await postSummaryForm({ ...defaultArgs, staleAnswerIds: [101] })

    expect(result).toEqual({ systemError: 'Delete failed' })
    expect(submitMock).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalledWith(expect.stringContaining('/bedankt'))
  })
})
