import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Mock, vi } from 'vitest'

import { postPrimaryForm } from './actions'
import { ENDPOINTS } from '../../mocks/endpoints'
import { server } from '../../mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postPrimaryForm', () => {
  const mockCookies = {
    set: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns an error message when postMelding returns an error', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json({ detail: 'Error message' }, { status: 404 })))

    const formData = new FormData()
    formData.set('primary', 'Test')

    const result = await postPrimaryForm(null, formData)

    expect(result).toEqual({ message: 'Error message' })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('redirects to /locatie when there are no additional questions', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm(null, formData)

    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 404 }),
      ),
    )

    const formData = new FormData()
    formData.set('primary', 'Test')

    const result = await postPrimaryForm(null, formData)

    expect(result).toEqual({ message: 'Error message' })
    expect(redirect).not.toHaveBeenCalled()
  })
})
