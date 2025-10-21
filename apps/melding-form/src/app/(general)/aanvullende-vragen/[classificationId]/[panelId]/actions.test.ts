import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { postForm } from './actions'
import { COOKIES } from 'apps/melding-form/src/constants'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postForm', () => {
  const defaultArgs = {
    isLastPanel: true,
    lastPanelPath: '/test',
    nextPanelPath: '/',
    questionKeysAndIds: [
      { key: 'key1', id: 1 },
      { key: 'key2', id: 2 },
    ],
    requiredQuestionKeys: [],
  }

  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('redirects to /cookie-storing when id or token is missing', async () => {
    // Override cookies mock for this specific test
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    const formData = new FormData()
    await postForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('sets lastPanelPath in cookies', async () => {
    const formData = new FormData()
    await postForm(defaultArgs, null, formData)

    const cookieInstance = await cookies()
    expect(cookieInstance.set).toHaveBeenCalledWith(COOKIES.LAST_PANEL_PATH, '/test')
  })

  it('returns validation errors for missing required questions', async () => {
    const formData = new FormData()
    formData.append('key1', 'value1') // key2 is missing

    const result = await postForm({ ...defaultArgs, requiredQuestionKeys: ['key1', 'key2'] }, null, formData)

    expect(result).toEqual({
      validationErrors: [{ key: 'key2', message: 'Vraag is verplicht en moet worden beantwoord.' }],
      formData,
    })
  })

  it('returns validation errors for other invalid answers', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID, () =>
        HttpResponse.json(
          { detail: [{ loc: ['key1'], msg: 'Validation error', type: 'value_error' }] },
          { status: 422 },
        ),
      ),
    )

    const formData = new FormData()
    formData.append('key1', 'value1')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({
      validationErrors: [{ key: 'key1', message: 'Validation error' }],
      formData,
    })
  })

  it('returns an error message if an error occurs when posting a single answer', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('key1', 'value1')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ formData, systemError: ['Error message'] })
  })

  it('returns a merged error message if multiple errors occur when posting multiple answers', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('key1', 'value1')
    formData.append('key2', 'value2')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ systemError: ['Error message', 'Error message'], formData })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ systemError: 'Error message', formData })
  })
})
