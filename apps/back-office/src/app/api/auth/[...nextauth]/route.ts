import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import KeycloakProvider from 'next-auth/providers/keycloak'

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
const refreshAccessToken = async (token: JWT) => {
  if (token.refreshTokenExpired && Date.now() > token.refreshTokenExpired) throw new Error()

  try {
    const response = await fetch(`${process.env.AUTH_ISSUER}/protocol/openid-connect/token`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID || '',
        client_secret: process.env.CLIENT_SECRET || '',
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
    console.log('--- TOKEN REFRESHED --- ')

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpired: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    // jwt: async ({ token, account, profile }) => {
    //   // Persist the OAuth access_token and or the user id to the token right after signin
    //   if (account) {
    //     // eslint-disable-next-line no-param-reassign
    //     token.accessToken = account.access_token
    //     // eslint-disable-next-line no-param-reassign
    //     token.id = profile.id
    //   }
    //   return token
    // },
    jwt: async ({ account, token, user }) => {
      console.log('--- account:', account)
      console.log('--- token:', token)
      console.log('--- user:', user)
      if (account && user) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        return {
          accessToken: account.access_token,
          accessTokenExpired: account.expires_at && account.expires_at * 1000,
          refreshToken: account.refresh_token,
          refreshTokenExpired: Date.now() + account.refresh_expires_in * 1000,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpired && Date.now() < token.accessTokenExpired) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    session: async ({ session, token }) => {
      // Send properties to the client, like an access_token and user id from a provider.
      // eslint-disable-next-line no-param-reassign
      session.accessToken = token.accessToken
      // eslint-disable-next-line no-param-reassign
      // session.user.id = token.id

      return session
    },
  },
})

export { handler as GET, handler as POST }
