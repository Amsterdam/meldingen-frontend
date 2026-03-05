import { render } from '@testing-library/react'

import * as apiClient from '@meldingen/api-client'

import { ApiClientInitializer } from './ApiClientInitializer'

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

  it('throws an error if NEXT_PUBLIC_BACKEND_BASE_URL is not set', () => {
    // Temporarily unset the environment variable
    vi.stubEnv('NEXT_PUBLIC_BACKEND_BASE_URL', undefined)

    expect(() => render(<ApiClientInitializer />)).toThrow(
      'NEXT_PUBLIC_BACKEND_BASE_URL environment variable must be set',
    )
  })

  it('calls client.setConfig with the correct baseUrl', async () => {
    render(<ApiClientInitializer />)

    expect(apiClient.client.setConfig).toHaveBeenCalledWith({
      baseUrl: 'testBaseUrl',
    })
  })

  it('renders null', () => {
    const { container } = render(<ApiClientInitializer />)

    expect(container.firstChild).toBeNull()
  })
})
