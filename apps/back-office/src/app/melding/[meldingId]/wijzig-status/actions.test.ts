import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postChangeStateForm, STATES_LIST } from './actions'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

describe('postChangeStateForm', () => {
  it('returns an error message for an invalid state', async () => {
    const formData = new FormData()
    formData.append('state', 'invalid')

    const result = await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(result).toEqual({
      error: { message: 'Invalid state: invalid', type: 'invalid_state' },
      meldingStateFromAction: 'invalid',
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('returns an error message when API returns an error', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PROCESS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('state', 'processing')

    const result = await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(result).toEqual({
      error: { message: { detail: 'Error message' }, type: 'state_change_failed' },
      meldingStateFromAction: 'processing',
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  STATES_LIST.forEach((state) => {
    it(`redirects on success when calling with ${state} state`, async () => {
      const formData = new FormData()
      formData.append('state', state)

      await postChangeStateForm({ meldingId: 123 }, null, formData)

      expect(redirect).toHaveBeenCalledWith('/melding/123')
    })
  })
})
