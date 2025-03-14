import NextAuth from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  // callbacks: {
  //   jwt: async ({ token, account }) => {
  //     if (account) {
  //       token.accessToken = account.access_token
  //     }
  //     return token
  //   },
  //   session: async ({ session, token }) => {
  //     session.accessToken = token.accessToken
  //     return session
  //   },
  // },
})

export { handler as GET, handler as POST }
