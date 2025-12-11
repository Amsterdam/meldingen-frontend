import type { JWT } from 'next-auth/jwt'

import { AuthOptions } from 'next-auth'
import AzureAD from 'next-auth/providers/azure-ad'
import KeycloakProvider from 'next-auth/providers/keycloak'

const isEntraAuthEnabled =
  Boolean(process.env.ENTRA_CLIENT_ID) &&
  Boolean(process.env.ENTRA_CLIENT_SECRET) &&
  Boolean(process.env.ENTRA_TENANT_ID)

/**
 * We cannot store the refresh token for Entra because it is bigger than 4kb combined with the access token.
 * For this reason the user gets logged out after the access token expires.
 * We should store the refresh token in a different secure storage, like a database through the backend.
 * For now, the user has to log in every 90 minutes (default access token lifetime).
 * https://gemeente-amsterdam.atlassian.net/browse/SIG-6986
 **/
const shouldStoreRefreshToken = isEntraAuthEnabled

const envVars = {
  clientId: isEntraAuthEnabled ? process.env.ENTRA_CLIENT_ID : process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: isEntraAuthEnabled ? process.env.ENTRA_CLIENT_SECRET : process.env.KEYCLOAK_CLIENT_SECRET,
  tokenUrl: isEntraAuthEnabled ? process.env.ENTRA_TOKEN_URL : process.env.KEYCLOAK_TOKEN_URL,
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken`, `accessTokenExpiresAt`, `refreshToken` and `refreshTokenExpiresAt` when an error occurs,
 * returns the old token and an error property
 */
const refreshAccessToken = async (token: JWT) => {
  try {
    // refreshTokenExpiresAt is Keycloak-specific
    if (token.refreshTokenExpiresAt && Date.now() > token.refreshTokenExpiresAt)
      throw new Error('Refresh token expired')

    const { clientId, clientSecret, tokenUrl } = envVars

    const response = await fetch(tokenUrl, {
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      }),
      cache: 'no-store',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
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

const getProviders = () => {
  if (isEntraAuthEnabled) {
    return [
      AzureAD({
        authorization: {
          params: {
            scope: `openid email ${process.env.ENTRA_CLIENT_ID}/.default offline_access`,
          },
        },
        clientId: process.env.ENTRA_CLIENT_ID,
        clientSecret: process.env.ENTRA_CLIENT_SECRET,
        tenantId: process.env.ENTRA_TENANT_ID,
      }),
    ]
  }

  return [
    KeycloakProvider({
      authorization: {
        params: {
          scope: 'openid email profile',
        },
        url: process.env.KEYCLOAK_AUTH_URL,
      },
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER_URL,
      jwks_endpoint: process.env.KEYCLOAK_JWKS_URL,
      token: process.env.KEYCLOAK_TOKEN_URL,
      userinfo: process.env.KEYCLOAK_USERINFO_URL,
      wellKnown: undefined,
    }),
  ]
}

export const authOptions: AuthOptions = {
  callbacks: {
    jwt: async ({ account, token, user }) => {
      // account is only available the first time this callback is called on a new session (after the user signs in)
      if (account && user) {
        console.log(JSON.stringify({account, user, token}))
        let baseToken: JWT = {
          accessToken: account.access_token,
          // Access token expiry date in milliseconds
          accessTokenExpiresAt: account.expires_at && account.expires_at * 1000,
          user,
        }

        if (shouldStoreRefreshToken) {
          baseToken = {
            ...baseToken,
            refreshToken: account.refresh_token,
            // Refresh token expiry date in milliseconds
            refreshTokenExpiresAt: account.refresh_expires_in && Date.now() + account.refresh_expires_in * 1000,
          }
        }

        return baseToken
      }

      console.log("Here 1");

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpiresAt && Date.now() < token.accessTokenExpiresAt) {
        console.log({token})
        return token
      }

      console.log("Here 2");

      // Access token has expired, try to update it
      if (shouldStoreRefreshToken) {
        console.log({token, ab: 'ab'})
        return refreshAccessToken(token)
      }
      

      console.log("Here 3");

      // We have no refresh token. Throwing an error forces sign in again
      throw new Error('Token has expired')
    },
    redirect: async ({ baseUrl, url }) => {
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
  providers: getProviders(),
}
