import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postReclassificationForm } from './actions'
import { REASON_COUNT_MAX_LENGTH } from './constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const createFormData = (input: {
  classificationId?: string
  isClassificationEmpty?: string
  isClassificationSelected?: string
  reason?: string
}) => {
  const formData = new FormData()

  if (input.classificationId !== undefined) {
    formData.append('classificationId', input.classificationId)
  }

  if (input.isClassificationEmpty !== undefined) {
    formData.append('isClassificationEmpty', input.isClassificationEmpty)
  }

  if (input.isClassificationSelected !== undefined) {
    formData.append('isClassificationSelected', input.isClassificationSelected)
  }

  if (input.reason !== undefined) {
    formData.append('reason', input.reason)
  }

  return formData
}

describe('postReclassificationForm', () => {
  const defaultArgs = { currentClassificationId: 2, meldingId: 123 }

  it('returns a validation error when no category is selected', async () => {
    const formData = createFormData({
      isClassificationEmpty: 'true',
      isClassificationSelected: 'false',
      reason: 'Need to correct the classification',
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'classificationId', message: 'classification-required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the selected category equals the current category', async () => {
    const formData = createFormData({
      classificationId: '2',
      isClassificationEmpty: 'false',
      isClassificationSelected: 'true',
      reason: 'Need to correct the classification',
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'classificationId', message: 'classification-same' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the typed category was not selected from the list', async () => {
    const formData = createFormData({
      classificationId: '2',
      isClassificationEmpty: 'false',
      isClassificationSelected: 'false',
      reason: 'Need to correct the classification',
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'classificationId', message: 'classification-does-not-exist' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when no reason is provided', async () => {
    const formData = createFormData({
      classificationId: '3',
      isClassificationEmpty: 'false',
      isClassificationSelected: 'true',
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reason', message: 'reason-required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the reason exceeds the maximum length', async () => {
    const formData = createFormData({
      classificationId: '3',
      isClassificationEmpty: 'false',
      isClassificationSelected: 'true',
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
    const formData = createFormData({
      isClassificationEmpty: 'true',
      isClassificationSelected: 'false',
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [
        { key: 'classificationId', message: 'classification-required' },
        { key: 'reason', message: 'reason-required' },
      ],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns an API error when the API returns an error', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_RECLASSIFICATION, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = createFormData({
      classificationId: '3',
      isClassificationEmpty: 'false',
      isClassificationSelected: 'true',
      reason: 'Need to correct the classification',
    })

    const result = await postReclassificationForm(defaultArgs, null, formData)

    expect(result).toEqual({
      apiError: { detail: 'Error message' },
      formData,
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success', async () => {
    const formData = createFormData({
      classificationId: '3',
      isClassificationEmpty: 'false',
      isClassificationSelected: 'true',
      reason: 'Need to correct the classification',
    })

    await postReclassificationForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })
})
