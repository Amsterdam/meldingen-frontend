import type { JWT } from 'next-auth/jwt'

import { AuthOptions } from 'next-auth'
import AzureAD from 'next-auth/providers/azure-ad'
import KeycloakProvider from 'next-auth/providers/keycloak'

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
  console.error("REFRESHING", token)
  try {
    // refreshTokenExpiresAt is Keycloak-specific
    if (token.refreshTokenExpiresAt && Date.now() > token.refreshTokenExpiresAt)
      throw new Error('Refresh token expired')

    const { clientId, clientSecret, tokenUrl } = envVars
    console.error("TOKEN STUFF", clientId, tokenUrl)

    console.error("The params are " + JSON.stringify({
        client_id: clientId,
        client_secret: 'secret',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      }))
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

    console.error("RESPONSE", response);

    if (!response.ok) {
      const responseText = await response.text();
      console.error("THROWING REFRESHED TOKENS", responseText, response.status)
      throw new Error('Failed to refresh access token ' + responseText)
    }

    const refreshedTokens = await response.json()

    console.error("RESPONSE", refreshedTokens);

    console.error("RETURNING");

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      refreshTokenExpiresAt:
        refreshedTokens.refresh_expires_in && Date.now() + refreshedTokens.refresh_expires_in * 1000,
    }
  } catch (e: any) {
    console.error("ERRORRRRRRRRRR " + e.message + "    " + e.toString())

    throw e;
  }
}

const getProviders = () => {
  if (isEntraAuthEnabled) {
    console.error("Entra is enabled");
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
    console.error("Keycloak is enabled");

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

      console.error('JWT DATA', { account }, { token }, { user })

      if (account && user) {
        const newToken = {
          ...token,
          accessToken: account.access_token,
          accessTokenExpiresAt: account.expires_at! * 1000,
          // idToken: account.id_token,
          // refreshToken: account.refresh_token,
          user,
        };
        console.error("returning token 1 " + JSON.stringify(newToken));
        return newToken
      }

      if (token.accessTokenExpiresAt && Date.now() / 1000 < token.accessTokenExpiresAt) {
        console.error("returning token 2" + JSON.stringify(token));
        return token
      }

      console.error("GOING TO REFRESH");
      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    redirect: async ({ baseUrl, url }) => {
      console.error("REDIRECT", baseUrl, url)
      // Use callback url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url

      return baseUrl
    },
    session: async ({ session, token }) => {
      console.error("SESSION", session, token)
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },
  providers: getProviders(),
}
