import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postChangeStateForm } from './actions'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

describe('postChangeStateForm', () => {
  it('returns an error message for an invalid state', async () => {
    const formData = new FormData()
    formData.append('state', 'invalid')

    const result = await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(result).toEqual({ message: 'invalid-state' })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('returns an error message when putMeldingByMeldingIdProcess returns an error', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PROCESS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('state', 'processing')

    const result = await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(result).toEqual({ message: 'Error message' })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('returns an error message when putMeldingByMeldingIdComplete returns an error', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_COMPLETE, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('state', 'completed')

    const result = await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(result).toEqual({ message: 'Error message' })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success when calling with "processing" state', async () => {
    const formData = new FormData()
    formData.append('state', 'processing')

    await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success when calling with "completed" state', async () => {
    const formData = new FormData()
    formData.append('state', 'completed')

    await postChangeStateForm({ meldingId: 123 }, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })
})
