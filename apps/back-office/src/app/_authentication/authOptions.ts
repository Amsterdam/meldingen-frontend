import type { JWT } from 'next-auth/jwt'

import { AuthOptions } from 'next-auth'
import AzureAD from 'next-auth/providers/azure-ad'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { cookies } from 'next/headers'

const isEntraAuthEnabled =
  Boolean(process.env.ENTRA_CLIENT_ID) &&
  Boolean(process.env.ENTRA_CLIENT_SECRET) &&
  Boolean(process.env.ENTRA_TENANT_ID)

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

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error('Failed to refresh access token ' + responseText)
    }

    const refreshedTokens = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      refreshTokenExpiresAt:
        refreshedTokens.refresh_expires_in && Date.now() + refreshedTokens.refresh_expires_in * 1000,
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
      if (account && user) {
        const cookieStore = await cookies();

        const newToken = {
          ...token,
          accessToken: account.access_token,
          accessTokenExpiresAt: account.expires_at! * 1000,
          // idToken: account.id_token,
          // refreshToken: account.refresh_token,
          user,
        };

        console.log("Got here");

        cookieStore.set('refresh', account.refresh_token, {
          httpOnly: true
        })

        console.log("Did not get here");

        return newToken
      }

      return token;
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
