import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postChangeStateForm } from './actions'
import { STATES_LIST } from './constants'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

const defaultArgs = { currentState: '', meldingId: 123 }

describe('postChangeStateForm', () => {
  it('redirects without calling API when selected state is the same as current state', async () => {
    const formData = new FormData()
    // We use an invalid state here, which should throw an error.
    // However, since the current state is the same as the selected state,
    // the function should return early and redirect without validating the state or calling the API.
    formData.append('state', 'invalid')

    await postChangeStateForm({ ...defaultArgs, currentState: 'invalid' }, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })

  it('returns an error message for an invalid state', async () => {
    const formData = new FormData()
    formData.append('state', 'invalid')

    const result = await postChangeStateForm(defaultArgs, null, formData)

    expect(result).toEqual({
      error: { message: 'Invalid state: invalid', type: 'invalid-state' },
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

    const result = await postChangeStateForm(defaultArgs, null, formData)

    expect(result).toEqual({
      error: { message: { detail: 'Error message' }, type: 'state-change-failed' },
      meldingStateFromAction: 'processing',
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  STATES_LIST.forEach((state) => {
    it(`redirects on success when calling with ${state} state`, async () => {
      const formData = new FormData()
      formData.append('state', state)

      await postChangeStateForm(defaultArgs, null, formData)

      expect(redirect).toHaveBeenCalledWith('/melding/123')
    })
  })
})
