/* eslint-disable no-param-reassign */
import type { NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

type Options = NextAuthOptions & {
  accessToken?: string
}

export const authOptions: Options = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      issuer: `${process.env.AUTH_ISSUER}`,
    }),
  ],
  callbacks: {
    jwt: async ({ account, token }) => {
      if (account) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        token.accessToken = account.access_token
      }
      return token
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken

      return session
    },
  },
}
