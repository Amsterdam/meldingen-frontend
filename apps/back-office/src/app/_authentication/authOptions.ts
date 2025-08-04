import { AuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import KeycloakProvider from 'next-auth/providers/keycloak'

/**
 * Takes a token, and returns a new token with updated
 * `accessToken`, `accessTokenExpiresAt`, `refreshToken` and `refreshTokenExpiresAt` when an error occurs,
 * returns the old token and an error property
 */
const refreshAccessToken = async (token: JWT) => {
  try {
    if (token.refreshTokenExpiresAt && Date.now() > token.refreshTokenExpiresAt)
      throw new Error('Refresh token expired')

    const response = await fetch(process.env.TOKEN_URL, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      }),
      method: 'POST',
      cache: 'no-store',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      refreshTokenExpiresAt:
        refreshedTokens.refresh_expires_in && Date.now() + refreshedTokens.refresh_expires_in * 1000,
    }
  } catch {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      wellKnown: undefined,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      issuer: process.env.ISSUER_URL,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
        url: process.env.AUTH_URL,
      },
      jwks_endpoint: process.env.JWKS_URL,
      token: process.env.TOKEN_URL,
      userinfo: process.env.USERINFO_URL,
    }),
  ],
  callbacks: {
    jwt: async ({ account, token, user }) => {
      if (account && user) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        return {
          accessToken: account.access_token,
          // Access token expiry date in milliseconds
          accessTokenExpiresAt: account.expires_at && account.expires_at * 1000,
          refreshToken: account.refresh_token,
          // Refresh token expiry date in milliseconds
          refreshTokenExpiresAt: account.refresh_expires_in && Date.now() + account.refresh_expires_in * 1000,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpiresAt && Date.now() < token.accessTokenExpiresAt) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    redirect: async ({ url, baseUrl }) => {
      // Use callback url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url

      return baseUrl
    },
    session: async ({ session, token }) => {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },
}
