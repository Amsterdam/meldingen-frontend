import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Mock, vi } from 'vitest'

import { COOKIES, TOP_ANCHOR_ID } from '../../constants'
import { ENDPOINTS } from '../../mocks/endpoints'
import { server } from '../../mocks/node'
import { postPrimaryForm } from './actions'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const formData = new FormData()

describe('postPrimaryForm', () => {
  const mockCookies = {
    delete: vi.fn(),
    set: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns a custom validation error when primary question is not answered', async () => {
    const result = await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'primary', message: 'Dit veld is verplicht.' }],
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

    const result = await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'primary', message: 'Validation error' }],
    })
  })

  it('returns an error message when postMelding returns an error', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json('Error message', { status: 404 })))

    const formData = new FormData()
    formData.set('primary', 'Test')

    const result = await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(result).toEqual({ formData, systemError: 'Error message' })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should set correct cookies', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.ID, '123', { maxAge: 86400 })
    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'test-token', { maxAge: 86400 })
    expect(mockCookies.delete).toHaveBeenCalledWith(COOKIES.LAST_PANEL_PATH)
    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.TYPE_NAMES, 'some-type', { maxAge: 86400 })
  })

  it('does not set typeNames cookies when absent from response', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING, () =>
        HttpResponse.json({
          classification: { id: 2, name: 'Test classification' },
          created_at: '2025-05-26T11:56:34.081Z',
          id: 123,
          public_id: 'B100AA',
          token: 'test-token',
        }),
      ),
    )

    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(mockCookies.set).not.toHaveBeenCalledWith(COOKIES.TYPE_NAMES, expect.anything(), expect.anything())
  })

  it('uses a PATCH request when id and token are passed to postPrimaryForm', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm(
      { existingId: '123', existingToken: 'test-token', requiredErrorMessage: 'Dit veld is verplicht.' },
      null,
      formData,
    )

    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'PATCH request', { maxAge: 86400 })
  })

  it('returns a system error when resolveClassificationRedirect returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.set('primary', 'Test')

    const result = await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(result).toEqual({ formData, systemError: 'Error message' })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('redirects to the correct URL when postPrimaryForm is successful', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')

    await postPrimaryForm({ requiredErrorMessage: 'Dit veld is verplicht.' }, null, formData)

    expect(redirect).toHaveBeenCalledWith(`/locatie#${TOP_ANCHOR_ID}`)
  })
})
