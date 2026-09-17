import { render } from '@testing-library/react'

import * as apiClient from '@meldingen/api-client'

import { ApiClientInitializer } from './ApiClientInitializer'
import { getClientEnv } from '~/env/client'

vi.mock('@meldingen/api-client', () => ({
  client: {
    setConfig: vi.fn(),
  },
}))

describe('ApiClientInitializer', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BACKEND_BASE_URL', 'testBaseUrl')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('calls client.setConfig with the correct baseUrl', async () => {
    render(<ApiClientInitializer />)

    expect(apiClient.client.setConfig).toHaveBeenCalledWith({
      baseUrl: getClientEnv().NEXT_PUBLIC_MELDING_FORM_BASE_URL,
    })
  })

  it('renders null', () => {
    const { container } = render(<ApiClientInitializer />)

    expect(container.firstChild).toBeNull()
  })
})
