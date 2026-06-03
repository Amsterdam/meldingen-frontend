import type { Session } from 'next-auth'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import './proxy'

const { captured } = vi.hoisted(() => {
  const captured: {
    auth?: () => Promise<string | undefined>
    baseUrl?: string
    errorInterceptor?: (error: unknown) => unknown
  } = {}
  return { captured }
})

vi.mock('@meldingen/api-client', () => ({
  client: {
    interceptors: {
      error: {
        use: (fn: (error: unknown) => unknown) => {
          captured.errorInterceptor = fn
        },
      },
    },
    setConfig: (config: { auth: () => Promise<string | undefined>; baseUrl?: string }) => {
      captured.auth = config.auth
      captured.baseUrl = config.baseUrl
    },
  },
}))

describe('apiClientProxy', () => {
  describe('error interceptor', () => {
    it('re-throws NEXT_REDIRECT errors', () => {
      const redirectError = new Error('NEXT_REDIRECT')
      expect(() => captured.errorInterceptor!(redirectError)).toThrow(redirectError)
    })

    it('returns non-redirect Error instances without throwing', () => {
      const error = new Error('some other error')
      expect(captured.errorInterceptor!(error)).toBe(error)
    })

    it('returns non-Error values without throwing', () => {
      const error = { code: 404 }
      expect(captured.errorInterceptor!(error)).toBe(error)
    })
  })

  describe('authorization', () => {
    it('redirects to sign in when there is no session', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null)

      try {
        await captured.auth!()
      } catch {
        // redirect() is mocked as vi.fn() so it doesn't halt execution;
        // accessing session.accessToken on null then throws
      }

      expect(redirect).toHaveBeenCalledWith('/api/auth/signin')
    })

    it('redirects to sign in when the session has no accessToken', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ expires: '', user: { email: null, image: null, name: null } })

      await captured.auth!()

      expect(redirect).toHaveBeenCalledWith('/api/auth/signin')
    })

    it('redirects to sign in when the session has an error', async () => {
      const session: Session = {
        accessToken: 'token',
        error: 'RefreshAccessTokenError',
        expires: '',
        user: { email: null, image: null, name: null },
      }
      vi.mocked(getServerSession).mockResolvedValueOnce(session)

      await captured.auth!()

      expect(redirect).toHaveBeenCalledWith('/api/auth/signin')
    })

    it('returns the access token for a valid session', async () => {
      const session: Session = {
        accessToken: 'valid-access-token',
        expires: '',
        user: { email: null, image: null, name: null },
      }
      vi.mocked(getServerSession).mockResolvedValueOnce(session)

      const token = await captured.auth!()

      expect(token).toBe('valid-access-token')
      expect(redirect).not.toHaveBeenCalled()
    })
  })

  describe('baseUrl configuration', () => {
    it('uses NEXT_INTERNAL_BACKEND_BASE_URL as the baseUrl', async () => {
      vi.stubEnv('NEXT_INTERNAL_BACKEND_BASE_URL', 'http://backend')
      vi.resetModules()

      await import('./proxy')

      expect(captured.baseUrl).toBe('http://backend')

      vi.unstubAllEnvs()
      vi.resetModules()
    })
  })
})
