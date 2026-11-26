import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'

import { client } from '@meldingen/api-client'

import { POST } from './route'
import { COOKIES, SESSION_COOKIE_OPTIONS, TOP_ANCHOR_ID } from '~/constants'
import { textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

const createRequest = (primary = 'Test', origin = 'http://localhost:3000') =>
  new Request('http://internal-host/melding', {
    body: new URLSearchParams({ primary }),
    headers: { origin },
    method: 'POST',
  })

describe('POST /melding', () => {
  const mockCookies = {
    delete: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  }

  beforeEach(() => {
    client.setConfig({ baseUrl: 'http://localhost:3000' })
    ;(cookies as Mock).mockResolvedValue(mockCookies)
    mockCookies.get.mockReturnValue(undefined)
  })

  it('rejects cross-origin submissions before processing the form', async () => {
    const response = await POST(createRequest('Test', 'https://other.example'))

    expect(response.status).toBe(403)
    expect(mockCookies.set).not.toHaveBeenCalled()
  })

  it('returns the fallback validation message when the primary question is not answered', async () => {
    const response = await POST(createRequest(''))

    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({
      type: 'validation-error',
      validationErrors: [{ key: 'primary', message: 'required-error-message-fallback' }],
    })
  })

  it('uses the required error message configured in the primary form', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({
          components: [
            {
              ...textAreaComponent,
              key: 'primary',
              validate: { required: true, required_error_message: 'Dit veld is verplicht.' },
            },
          ],
        }),
      ),
    )

    const response = await POST(createRequest(''))

    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({
      type: 'validation-error',
      validationErrors: [{ key: 'primary', message: 'Dit veld is verplicht.' }],
    })
  })

  it('forwards the submitted text to the backend and returns the next destination', async () => {
    const requestBody = vi.fn()

    server.use(
      http.post(ENDPOINTS.POST_MELDING, async ({ request }) => {
        requestBody(await request.json())

        return HttpResponse.json({ id: 123, token: 'test-token' })
      }),
    )

    const response = await POST(createRequest('Er ligt afval op straat'))

    expect(requestBody).toHaveBeenCalledWith({ text: 'Er ligt afval op straat' })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ redirectUrl: `/locatie#${TOP_ANCHOR_ID}`, type: 'success' })
    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.ID, '123', SESSION_COOKIE_OPTIONS)
    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'test-token', SESSION_COOKIE_OPTIONS)
    expect(mockCookies.delete).toHaveBeenCalledWith(COOKIES.LAST_PANEL_PATH)
  })

  it('updates an existing report using the id and token from cookies', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === COOKIES.ID) return { value: '123' }
      if (name === COOKIES.TOKEN) return { value: 'test-token' }
    })
    const requestDetails = vi.fn()

    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_MELDER, async ({ request }) => {
        requestDetails(await request.json(), new URL(request.url).searchParams.get('token'))

        return HttpResponse.json({ id: 123, token: 'updated-token' })
      }),
    )

    const response = await POST(createRequest('Updated text'))

    expect(response.status).toBe(200)
    expect(requestDetails).toHaveBeenCalledWith({ text: 'Updated text' }, 'test-token')
    expect(mockCookies.set).toHaveBeenCalledWith(COOKIES.TOKEN, 'updated-token', SESSION_COOKIE_OPTIONS)
  })

  it('returns backend validation errors', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING, () =>
        HttpResponse.json(
          { detail: [{ loc: ['primary'], msg: 'Validation error', type: 'value_error' }] },
          { status: 422 },
        ),
      ),
    )

    const response = await POST(createRequest())

    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({
      type: 'validation-error',
      validationErrors: [{ key: 'primary', message: 'Validation error' }],
    })
    expect(mockCookies.set).not.toHaveBeenCalled()
  })

  it('returns API errors without setting session cookies', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json('Error message', { status: 500 })))

    const response = await POST(createRequest())

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ apiError: 'Error message', type: 'api-error' })
    expect(mockCookies.set).not.toHaveBeenCalled()
  })

  it('returns errors from resolving the classification destination', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const response = await POST(createRequest())

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ apiError: 'Error message', type: 'api-error' })
  })

  it('returns the additional questions destination for a classified report', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({ components: [{ key: 'first-panel' }] }),
      ),
    )

    const response = await POST(createRequest())

    expect(await response.json()).toEqual({
      redirectUrl: `/aanvullende-vragen/2/first-panel#${TOP_ANCHOR_ID}`,
      type: 'success',
    })
  })
})
