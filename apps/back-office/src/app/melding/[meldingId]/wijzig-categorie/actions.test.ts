import { redirect } from 'next/navigation'

import { postChangeCategoryForm } from './actions'
import { ERRORS, REASON_COUNT_MAX_LENGTH } from './constants'
import * as apiClientProxy from '~/app/_api-client/proxy'

describe('postChangeCategoryForm', () => {
  const defaultArgs = { currentClassificationId: 2, meldingId: 123 }
  const defaultPrevResult = {}

  const submitChangeCategoryForm = async (
    input: {
      category: string
      reason: string
    },
    currentClassificationId = defaultArgs.currentClassificationId,
  ) => postChangeCategoryForm(defaultArgs.meldingId, currentClassificationId, defaultPrevResult, input)

  it('returns a validation error when no category is selected', async () => {
    const result = await submitChangeCategoryForm({
      category: '',
      reason: 'Need to correct the classification',
    })

    expect(result.validationErrors?.category?._errors).toEqual([ERRORS.VALIDATION.CATEGORY_REQUIRED])
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the selected category equals the current category', async () => {
    const result = await submitChangeCategoryForm({
      category: '2',
      reason: 'Need to correct the classification',
    })

    expect(result.validationErrors?.category?._errors).toEqual([ERRORS.VALIDATION.CATEGORY_SAME])
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when no reason is provided', async () => {
    const result = await submitChangeCategoryForm({
      category: '3',
      reason: '',
    })

    expect(result.validationErrors?.reason?._errors).toEqual([ERRORS.VALIDATION.REASON_REQUIRED])
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when the reason exceeds the maximum length', async () => {
    const result = await submitChangeCategoryForm({
      category: '3',
      reason: 'a'.repeat(REASON_COUNT_MAX_LENGTH + 1),
    })

    expect(result.validationErrors?.reason?._errors).toEqual([ERRORS.VALIDATION.REASON_MAX_LENGTH])
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns all validation errors together when multiple fields are invalid', async () => {
    const result = await submitChangeCategoryForm({
      category: '',
      reason: '',
    })

    expect(result.validationErrors?.category?._errors).toEqual([ERRORS.VALIDATION.CATEGORY_REQUIRED])
    expect(result.validationErrors?.reason?._errors).toEqual([ERRORS.VALIDATION.REASON_REQUIRED])
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a server error when the API request throws', async () => {
    const spy = vi
      .spyOn(apiClientProxy, 'postMeldingByMeldingIdReclassification')
      .mockRejectedValueOnce(new Error('API request failed'))

    const result = await submitChangeCategoryForm({
      category: '3',
      reason: 'Need to correct the classification',
    })

    expect(result.serverError).toBe('Something went wrong while executing the operation.')
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')

    spy.mockRestore()
  })

  it('redirects on success', async () => {
    const spy = vi.spyOn(apiClientProxy, 'postMeldingByMeldingIdReclassification').mockResolvedValue({
      data: {},
      response: new Response(),
    } as Awaited<ReturnType<typeof apiClientProxy.postMeldingByMeldingIdReclassification>>)

    await submitChangeCategoryForm({
      category: '3',
      reason: 'Need to correct the classification',
    })

    expect(redirect).toHaveBeenCalledWith('/melding/123')
    expect(spy).toHaveBeenCalledWith({
      body: {
        classification_id: 3,
        reason: 'Need to correct the classification',
      },
      path: { melding_id: 123 },
      throwOnError: true,
    })

    spy.mockRestore()
  })
})
