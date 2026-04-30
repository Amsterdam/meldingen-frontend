import * as apiClientProxy from '~/apiClientProxy'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { URGENCY_VALUES } from '../../../../constants'
import { postChangeUrgencyForm } from './actions'

describe('postChangeUrgencyForm', () => {
  const defaultArgs = { currentUrgency: 0 as const, meldingId: 123 }

  it('redirects without calling API when selected urgency is the same as current urgency', async () => {
    const spy = vi.spyOn(apiClientProxy, 'patchMeldingByMeldingId')

    const formData = new FormData()
    formData.append('urgency', '0')

    await postChangeUrgencyForm({ ...defaultArgs, currentUrgency: 0 }, null, formData)

    expect(spy).not.toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/melding/123')

    spy.mockRestore()
  })

  it('returns an error message for an invalid urgency', async () => {
    const formData = new FormData()
    formData.append('urgency', '999')

    const result = await postChangeUrgencyForm(defaultArgs, null, formData)

    expect(result).toEqual({
      error: { message: 'Invalid urgency: 999', type: 'invalid-urgency' },
      urgencyFromAction: '999',
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('returns an error message when API returns an error', async () => {
    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('urgency', '1')

    const result = await postChangeUrgencyForm(defaultArgs, null, formData)

    expect(result).toEqual({
      error: { message: { detail: 'Error message' }, type: 'urgency-change-failed' },
      urgencyFromAction: '1',
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it.each(URGENCY_VALUES)('redirects on success', async (urgency) => {
    const formData = new FormData()
    formData.append('urgency', String(urgency))

    await postChangeUrgencyForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })
})
