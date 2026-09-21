import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postReclassificationForm } from './actions'
import { REASON_COUNT_MAX_LENGTH } from './constants'
import { server } from '~/mocks/node'

const RECLASSIFICATION_ENDPOINT = '/melding/:id/reclassification'

const createFormData = (input: { classification?: string; reason?: string }) => {
  const formData = new FormData()

  if (input.classification !== undefined) {
    formData.append('classification', input.classification)
  }

  if (input.reason !== undefined) {
    formData.append('reason', input.reason)
  }

  return formData
}

describe('postReclassificationForm', () => {
  const defaultArgs = { currentClassificationId: 2, meldingId: 123 }

  it('returns a validation error when no category is selected', async () => {
    const formData = createFormData({ reason: 'Need to correct the classification' })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'classification', message: 'classification-required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the selected category equals the current category', async () => {
    const formData = createFormData({ classification: '2', reason: 'Need to correct the classification' })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'classification', message: 'classification-same' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when no reason is provided', async () => {
    const formData = createFormData({ classification: '3' })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reason', message: 'reason-required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the reason exceeds the maximum length', async () => {
    const formData = createFormData({
      classification: '3',
      reason: 'a'.repeat(REASON_COUNT_MAX_LENGTH + 1),
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reason', message: 'reason-max-length' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns all validation errors together when multiple fields are invalid', async () => {
    const formData = createFormData({})

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [
        { key: 'classification', message: 'classification-required' },
        { key: 'reason', message: 'reason-required' },
      ],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns an API error when the API returns an error', async () => {
    server.use(
      http.post(RECLASSIFICATION_ENDPOINT, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
    )

    const formData = createFormData({ classification: '3', reason: 'Need to correct the classification' })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      apiError: { detail: 'Error message' },
      formData,
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success', async () => {
    server.use(http.post(RECLASSIFICATION_ENDPOINT, () => new HttpResponse(undefined, { status: 201 })))

    const formData = createFormData({ classification: '3', reason: 'Need to correct the classification' })

    await postReclassificationForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })
})
