import { client } from 'libs/api-client/src/client.gen'
import { http, HttpResponse } from 'msw'

import { changeMeldingState } from './actions'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({})),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Vitest doesn't seem to pick up env vars in this app, for some reason.
// So we set a mock base URL directly in the test.
client.setConfig({
  baseUrl: 'http://localhost:3000',
})

describe('changeMeldingState', () => {
  it('returns an error message for an invalid state', async () => {
    const result = await changeMeldingState(null, { id: 123, state: 'invalid' as never })

    expect(result).toEqual({ message: 'invalid-state' })
  })

  it('does not return an error when calling with "processing" state', async () => {
    const result = await changeMeldingState(null, { id: 123, state: 'processing' })

    expect(result).toBeUndefined()
  })

  it('does not return an error when calling with "processing" state', async () => {
    const result = await changeMeldingState(null, { id: 123, state: 'completed' })

    expect(result).toBeUndefined()
  })

  it('returns an error message for API errors', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PROCESS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await changeMeldingState(null, { id: 123, state: 'processing' })

    expect(result).toEqual({ message: 'Error message' })
  })
})
