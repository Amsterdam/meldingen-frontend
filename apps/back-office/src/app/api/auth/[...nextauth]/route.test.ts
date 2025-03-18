import { refreshAccessToken } from './route'

vi.stubEnv('AUTH_ISSUER', 'https://mock-auth.com')
vi.stubEnv('CLIENT_ID', 'mock-client-id')
vi.stubEnv('CLIENT_SECRET', 'mock-client-secret')

describe('refreshAccessToken', () => {
  const mockToken = {
    accessToken: 'oldAccessToken',
    refreshToken: 'validRefreshToken',
    refreshTokenExpiresAt: Date.now() + 10000, // Not expired
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('refreshes the access token successfully', async () => {
    const updatedToken = await refreshAccessToken(mockToken)

    expect(updatedToken).toMatchObject({
      accessToken: 'new-token',
      refreshToken: 'new-refresh-token',
    })
  })

  it('returns an error if the refresh token is expired', async () => {
    const expiredToken = { ...mockToken, refreshTokenExpiresAt: Date.now() - 1000 }

    const result = await refreshAccessToken(expiredToken)

    expect(result).toMatchObject({ error: 'RefreshAccessTokenError' })
  })
})
