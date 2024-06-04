/* eslint-disable no-param-reassign */
import type { NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

import { refreshAccessToken } from './refresh-access-token'

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      issuer: `${process.env.AUTH_ISSUER}`,
    }),
  ],
  callbacks: {
    jwt: async ({ account, token, user }) => {
      if (account && user) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        return {
          accessToken: account.access_token,
          accessTokenExpired: account.expires_at && account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        }
      }

      if (token.accessTokenExpired && Date.now() < token.accessTokenExpired) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    },
  },
}
