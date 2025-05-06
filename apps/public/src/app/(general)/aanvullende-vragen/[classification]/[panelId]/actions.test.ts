import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import { postForm } from './actions'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postForm', () => {
  const defaultArgs = {
    isLastPanel: true,
    lastPanelPath: '/',
    nextPanelPath: '/',
    questionIds: [{ key: 'key', id: 1 }],
  }

  const mockCookies = {
    get: vi.fn(),
    set: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns undefined when id or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const formData = new FormData()
    const result = await postForm(defaultArgs, null, formData)

    expect(result).toBeUndefined()
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () =>
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

    const formData = new FormData()

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ message: 'Error message' })
  })
})
