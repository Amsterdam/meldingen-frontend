import type { Account } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

import { http, HttpResponse } from 'msw'

import { server } from '~/mocks/node'

const tokenUrl = 'http://localhost:3000/test-auth/token'
const now = new Date('2026-10-29T12:00:00Z').getTime()

const expiredToken: JWT = {
  accessToken: 'expired-access-token',
  accessTokenExpiresAt: now - 1000,
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: now + 60_000,
}

const runJwt = async (token: JWT, account: Account | null = null) => {
  const { authOptions } = await import('./authOptions')

  return authOptions.callbacks!.jwt!({ account, token, user: { id: 'user-id' } })
}

describe('authentication token lifecycle', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.setSystemTime(now)
    vi.stubEnv('ENTRA_CLIENT_ID', '')
    vi.stubEnv('ENTRA_CLIENT_SECRET', '')
    vi.stubEnv('ENTRA_TENANT_ID', '')
    vi.stubEnv('KEYCLOAK_CLIENT_ID', 'test-client')
    vi.stubEnv('KEYCLOAK_CLIENT_SECRET', 'test-secret')
    vi.stubEnv('KEYCLOAK_TOKEN_URL', tokenUrl)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it('captures tokens and converts expiry values to milliseconds on sign-in', async () => {
    const result = await runJwt(
      {},
      {
        access_token: 'access-token',
        expires_at: now / 1000 + 300,
        provider: 'keycloak',
        providerAccountId: 'user-id',
        refresh_expires_in: 600,
        refresh_token: 'refresh-token',
        type: 'oauth',
      },
    )

    expect(result).toMatchObject({
      accessToken: 'access-token',
      accessTokenExpiresAt: now + 300_000,
      refreshToken: 'refresh-token',
      refreshTokenExpiresAt: now + 600_000,
      user: { id: 'user-id' },
    })
  })

  it('keeps an unexpired access token without requesting a refresh', async () => {
    const refresh = vi.fn(() => HttpResponse.json({}))

    server.use(http.post(tokenUrl, refresh))

    const token = { ...expiredToken, accessTokenExpiresAt: now + 1000 }

    expect(await runJwt(token)).toEqual(token)
    expect(refresh).not.toHaveBeenCalled()
  })

  it('refreshes at the expiry boundary with the expected credentials and rotates tokens', async () => {
    const refresh = vi.fn(async ({ request }: { request: Request }) => {
      expect(request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded')
      expect(Object.fromEntries(new URLSearchParams(await request.text()))).toEqual({
        client_id: 'test-client',
        client_secret: 'test-secret',
        grant_type: 'refresh_token',
        refresh_token: 'refresh-token',
      })

      return HttpResponse.json({
        access_token: 'new-access-token',
        expires_in: 300,
        refresh_expires_in: 600,
        refresh_token: 'new-refresh-token',
      })
    })

    server.use(http.post(tokenUrl, refresh))

    expect(await runJwt({ ...expiredToken, accessTokenExpiresAt: now })).toMatchObject({
      accessToken: 'new-access-token',
      accessTokenExpiresAt: now + 300_000,
      refreshToken: 'new-refresh-token',
      refreshTokenExpiresAt: now + 600_000,
    })
    expect(refresh).toHaveBeenCalledOnce()
  })

  it('keeps the previous refresh token when the response does not rotate it', async () => {
    server.use(http.post(tokenUrl, () => HttpResponse.json({ access_token: 'new-access-token', expires_in: 300 })))

    expect(await runJwt(expiredToken)).toMatchObject({
      accessToken: 'new-access-token',
      refreshToken: 'refresh-token',
    })
  })

  it('reports an expired refresh token without making a network request', async () => {
    const refresh = vi.fn(() => HttpResponse.json({}))

    server.use(http.post(tokenUrl, refresh))

    const token = { ...expiredToken, refreshTokenExpiresAt: now - 1000 }

    expect(await runJwt(token)).toEqual({ ...token, error: 'RefreshAccessTokenError' })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('reports an unsuccessful refresh response', async () => {
    server.use(http.post(tokenUrl, () => HttpResponse.json({ error: 'invalid_grant' }, { status: 400 })))

    expect(await runJwt(expiredToken)).toEqual({ ...expiredToken, error: 'RefreshAccessTokenError' })
  })

  it('reports a network failure during refresh', async () => {
    server.use(http.post(tokenUrl, () => HttpResponse.error()))

    expect(await runJwt(expiredToken)).toEqual({ ...expiredToken, error: 'RefreshAccessTokenError' })
  })

  describe('Entra authentication', () => {
    beforeEach(() => {
      vi.stubEnv('ENTRA_CLIENT_ID', 'entra-client')
      vi.stubEnv('ENTRA_CLIENT_SECRET', 'entra-secret')
      vi.stubEnv('ENTRA_TENANT_ID', 'entra-tenant')
    })

    it('does not store the refresh token on sign-in', async () => {
      const result = await runJwt(
        {},
        {
          access_token: 'entra-access-token',
          expires_at: now / 1000 + 300,
          provider: 'azure-ad',
          providerAccountId: 'user-id',
          refresh_token: 'large-refresh-token',
          type: 'oauth',
        },
      )

      expect(result.accessToken).toBe('entra-access-token')
      expect(result.refreshToken).toBeUndefined()
    })

    it('keeps a valid access token', async () => {
      const token = { accessToken: 'entra-access-token', accessTokenExpiresAt: now + 1000 }

      expect(await runJwt(token)).toEqual(token)
    })

    it('requires reauthentication when the access token expires without refreshing', async () => {
      const refresh = vi.fn(() => HttpResponse.json({}))

      server.use(http.post(tokenUrl, refresh))

      expect(await runJwt(expiredToken)).toEqual({ ...expiredToken, error: 'AccessTokenExpired' })
      expect(refresh).not.toHaveBeenCalled()
    })
  })

  it('exposes the token error to session consumers', async () => {
    const { authOptions } = await import('./authOptions')
    const session = { expires: '2026-10-30T12:00:00Z' }
    const token = { ...expiredToken, error: 'RefreshAccessTokenError' }

    const result = await authOptions.callbacks!.session!({
      newSession: session,
      session,
      token,
      trigger: 'update',
      user: { email: 'user@example.com', emailVerified: null, id: 'user-id' },
    })

    expect(result).toMatchObject({ accessToken: token.accessToken, error: 'RefreshAccessTokenError' })
  })
})
