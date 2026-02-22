import { render } from '@testing-library/react'

import * as apiClient from '@meldingen/api-client'

import { ApiClientInitializer } from './ApiClientInitializer'

vi.mock('@meldingen/api-client', () => ({
  client: {
    setConfig: vi.fn(),
  },
}))

describe('ApiClientInitializer', () => {
  it('should call client.setConfig with the correct baseUrl', async () => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'testBaseUrl'

    render(<ApiClientInitializer />)

    expect(apiClient.client.setConfig).toHaveBeenCalledWith({
      baseUrl: 'testBaseUrl',
    })
  })

  it('should render null', () => {
    const { container } = render(<ApiClientInitializer />)

    expect(container.firstChild).toBeNull()
  })
})
