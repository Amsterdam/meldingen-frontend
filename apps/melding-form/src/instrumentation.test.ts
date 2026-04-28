import { client } from '@meldingen/api-client'

import { register } from './instrumentation'

vi.mock('@meldingen/api-client', () => ({
  client: {
    setConfig: vi.fn(),
  },
}))

describe('register', () => {
  it('calls client.setConfig with NEXT_INTERNAL_BACKEND_BASE_URL', () => {
    vi.stubEnv('NEXT_INTERNAL_BACKEND_BASE_URL', 'http://backend.internal')

    register()

    expect(client.setConfig).toHaveBeenCalledWith({ baseUrl: 'http://backend.internal' })

    vi.unstubAllEnvs()
  })
})
