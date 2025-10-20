import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Mock, vi } from 'vitest'

import { postPrimaryForm } from './actions'
import { SESSION_COOKIES } from '../../constants'
import { form } from '../../mocks/data'
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
    delete: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns a validation error when primary question is not answered', async () => {
    const formData = new FormData()

    const result = await postPrimaryForm({}, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'primary', message: 'Vraag is verplicht en moet worden beantwoord.' }],
    })
  })

  it('returns validation errors for other invalid answers', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING, () =>
        HttpResponse.json(
          { detail: [{ loc: ['primary'], msg: 'Validation error', type: 'value_error' }] },
          { status: 422 },
        ),
      ),
    )

    const formData = new FormData()
    formData.append('primary', 'value1')

    const result = await postPrimaryForm({}, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'primary', message: 'Validation error' }],
    })
  })

  it('returns an error message when postMelding returns an error', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json('Error message', { status: 404 })))

    const formData = new FormData()
    formData.set('primary', 'Test')

    const result = await postPrimaryForm({}, null, formData)

    expect(result).toEqual({ formData, systemError: 'Error message' })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns an error when postMelding does not return data', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING, () => new HttpResponse()))

    const formData = new FormData()
    formData.set('primary', 'Test')

    const result = await postPrimaryForm({}, null, formData)

    expect(result).toEqual({ formData, systemError: new Error('Melding data not found.') })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should set correct cookies', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm({}, null, formData)

    expect(mockCookies.set).toHaveBeenCalledWith(SESSION_COOKIES.ID, '123', { maxAge: 86400 })
    expect(mockCookies.set).toHaveBeenCalledWith(SESSION_COOKIES.CREATED_AT, '2025-05-26T11:56:34.081Z', {
      maxAge: 86400,
    })
    expect(mockCookies.set).toHaveBeenCalledWith(SESSION_COOKIES.PUBLIC_ID, 'B100AA', { maxAge: 86400 })
    expect(mockCookies.set).toHaveBeenCalledWith(SESSION_COOKIES.TOKEN, 'test-token', { maxAge: 86400 })
    expect(mockCookies.delete).toHaveBeenCalledWith(SESSION_COOKIES.LAST_PANEL_PATH)
  })

  it('uses a PATCH request when id and token are passed to postPrimaryForm', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm({ existingId: '123', existingToken: 'test-token' }, null, formData)

    expect(mockCookies.set).toHaveBeenCalledWith(SESSION_COOKIES.PUBLIC_ID, 'PATCH request', { maxAge: 86400 })
  })

  describe('with classification', () => {
    it('returns an error when getFormClassificationByClassificationId returns an error', async () => {
      server.use(
        http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
          HttpResponse.json('Error message', { status: 500 }),
        ),
      )

      const formData = new FormData()
      formData.set('primary', 'Test')

      const result = await postPrimaryForm({}, null, formData)

      expect(result).toEqual({ formData, systemError: 'Error message' })
      expect(redirect).not.toHaveBeenCalled()
    })

    it('returns an error message if an error occurs when changing melding state', async () => {
      server.use(
        http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () =>
          HttpResponse.json('Error message', { status: 404 }),
        ),
      )

      const formData = new FormData()
      formData.set('primary', 'Test')

      const result = await postPrimaryForm({}, null, formData)

      expect(result).toEqual({ formData, systemError: 'Error message' })
      expect(redirect).not.toHaveBeenCalled()
    })

    it('redirects to /locatie when there are no additional questions', async () => {
      const formData = new FormData()
      formData.set('primary', 'Test')

      await postPrimaryForm({}, null, formData)

      expect(redirect).toHaveBeenCalledWith('/locatie')
    })

    it('redirects to /aanvullende-vragen when there are additional questions', async () => {
      server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(form)))

      const formData = new FormData()
      formData.set('primary', 'Test')

      await postPrimaryForm({}, null, formData)

      expect(redirect).toHaveBeenCalledWith('/aanvullende-vragen/2/page1')
    })
  })

  it('redirects to /locatie when there is no classification', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING, () =>
        HttpResponse.json({
          id: 123,
          created_at: '2025-05-26T11:56:34.081Z',
          public_id: 'B100AA',
          token: 'test-token',
          classification: undefined,
        }),
      ),
    )

    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm({}, null, formData)

    expect(redirect).toHaveBeenCalledWith('/locatie')
  })
})
