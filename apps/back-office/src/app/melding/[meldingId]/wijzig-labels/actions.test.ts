import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postChangeLabelsForm } from './actions'
import * as apiClientProxy from '~/app/_api-client/proxy'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

describe('postChangeLabelsForm', () => {
  const defaultArgs = { currentLabelIds: [], meldingId: 123 }

  it('redirects without calling API when selected labels are the same as current labels', async () => {
    const spy = vi.spyOn(apiClientProxy, 'patchMeldingByMeldingId')

    const formData = new FormData()
    formData.append('labels', '0')

    await postChangeLabelsForm({ ...defaultArgs, currentLabelIds: [0] }, null, formData)

    expect(spy).not.toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/melding/123')

    spy.mockRestore()
  })

  it('redirects without calling API when no labels are selected and current labels is undefined', async () => {
    const spy = vi.spyOn(apiClientProxy, 'patchMeldingByMeldingId')

    const formData = new FormData()

    await postChangeLabelsForm({ ...defaultArgs, currentLabelIds: undefined }, null, formData)

    expect(spy).not.toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/melding/123')

    spy.mockRestore()
  })

  it('returns an error message when API returns an error', async () => {
    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('labels', '1')

    const result = await postChangeLabelsForm(defaultArgs, null, formData)

    expect(result).toEqual({
      error: { detail: 'Error message' },
      labelIdsFromAction: [1],
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success', async () => {
    const formData = new FormData()
    formData.append('labels', '1')

    await postChangeLabelsForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })
})
