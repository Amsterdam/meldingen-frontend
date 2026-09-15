import { redirect } from 'next/navigation'

import { postChangeCategoryForm } from './actions'
import { REASON_COUNT_MAX_LENGTH } from './constants'
import * as apiClientProxy from '~/app/_api-client/proxy'

describe('postChangeCategoryForm', () => {
  const defaultArgs = { currentClassificationId: 2, meldingId: 123 }

  const createFormData = (input: { category?: string; reason?: string }) => {
    const formData = new FormData()

    if (input.category !== undefined) {
      formData.append('category', input.category)
    }

    if (input.reason !== undefined) {
      formData.append('reason', input.reason)
    }

    return formData
  }

  it('returns a validation error when no category is selected', async () => {
    const formData = createFormData({ reason: 'Need to correct the classification' })

    const result = await postChangeCategoryForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'category', message: 'category-required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the selected category equals the current category', async () => {
    const formData = createFormData({ category: '2', reason: 'Need to correct the classification' })

    const result = await postChangeCategoryForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'category', message: 'category-same' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when no reason is provided', async () => {
    const formData = createFormData({ category: '3' })

    const result = await postChangeCategoryForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reason', message: 'reason-required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the reason exceeds the maximum length', async () => {
    const formData = createFormData({
      category: '3',
      reason: 'a'.repeat(REASON_COUNT_MAX_LENGTH + 1),
    })

    const result = await postChangeCategoryForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reason', message: 'reason-max-length' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns all validation errors together when multiple fields are invalid', async () => {
    const formData = createFormData({})

    const result = await postChangeCategoryForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [
        { key: 'category', message: 'category-required' },
        { key: 'reason', message: 'reason-required' },
      ],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns an API error when the API returns an error', async () => {
    const spy = vi.spyOn(apiClientProxy, 'postMeldingByMeldingIdReclassification').mockResolvedValue({
      error: { detail: 'Error message' },
    } as Awaited<ReturnType<typeof apiClientProxy.postMeldingByMeldingIdReclassification>>)

    const formData = createFormData({ category: '3', reason: 'Need to correct the classification' })

    const result = await postChangeCategoryForm(defaultArgs, null, formData)

    expect(result).toEqual({
      apiError: { detail: 'Error message' },
      validationErrors: [],
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')

    spy.mockRestore()
  })

  it('redirects on success', async () => {
    const spy = vi.spyOn(apiClientProxy, 'postMeldingByMeldingIdReclassification').mockResolvedValue({
      error: undefined,
    } as Awaited<ReturnType<typeof apiClientProxy.postMeldingByMeldingIdReclassification>>)

    const formData = createFormData({ category: '3', reason: 'Need to correct the classification' })

    await postChangeCategoryForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')

    spy.mockRestore()
  })
})
