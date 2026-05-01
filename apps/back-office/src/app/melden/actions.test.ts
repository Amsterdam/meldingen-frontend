import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import { postMeldingForm } from './actions'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postMeldingForm', () => {
  it('returns a custom validation error when primary question is not answered', async () => {
    const formData = new FormData()

    const result = await postMeldingForm(null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'primary', message: 'This field is required.' }],
    })
  })

  it('returns a validation error when urgency is invalid', async () => {
    const formData = new FormData()
    formData.set('primary', 'Test')
    formData.set('urgency', 'invalid')

    const result = await postMeldingForm(null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'urgency', message: 'Invalid urgency: invalid' }],
    })
  })

  it('returns a system error when postMelding returns an error', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json('Error message', { status: 404 })))

    const formData = new FormData()
    formData.set('primary', 'Test')
    formData.set('urgency', '1')

    const result = await postMeldingForm(null, formData)

    expect(result).toEqual({ formData, systemError: 'Error message' })
  })

  it('returns a system error when patchMeldingByMeldingId returns an error', async () => {
    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID, () => HttpResponse.json('Error message', { status: 404 })),
    )

    const formData = new FormData()
    formData.set('primary', 'Test')
    formData.set('urgency', '1')

    const result = await postMeldingForm(null, formData)

    expect(result).toEqual({ formData, systemError: 'Error message' })
  })

  it('redirects to the correct URL when postMeldingForm is successful', async () => {
    vi.stubEnv('NEXT_PUBLIC_MELDING_FORM_BASE_URL', 'testBaseUrl')

    const formData = new FormData()
    formData.set('primary', 'Test')
    formData.set('urgency', '1')

    await postMeldingForm(null, formData)

    const params = new URLSearchParams({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '123',
      public_id: 'B100AA',
      token: 'test-token',
    })
    params.set('classification_id', '2')

    expect(redirect).toHaveBeenCalledWith(`testBaseUrl/back-office-entry?${params}`)

    vi.unstubAllEnvs()
  })

  it('redirects to the correct URL without classification_id when classification is not returned', async () => {
    vi.stubEnv('NEXT_PUBLIC_MELDING_FORM_BASE_URL', 'testBaseUrl')

    server.use(
      http.post(ENDPOINTS.POST_MELDING, () =>
        HttpResponse.json({
          created_at: '2025-05-26T11:56:34.081Z',
          id: 123,
          public_id: 'B100AA',
          token: 'test-token',
        }),
      ),
    )

    const formData = new FormData()
    formData.set('primary', 'Test')
    formData.set('urgency', '1')

    await postMeldingForm(null, formData)

    const params = new URLSearchParams({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '123',
      public_id: 'B100AA',
      token: 'test-token',
    })

    expect(redirect).toHaveBeenCalledWith(`testBaseUrl/back-office-entry?${params}`)

    vi.unstubAllEnvs()
  })
})
