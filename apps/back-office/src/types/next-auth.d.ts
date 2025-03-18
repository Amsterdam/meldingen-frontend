/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  type Session = {
    accessToken?: string
    error?: string
  }

  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  type Account = {
    refresh_expires_in?: number
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  type JWT = {
    /** OpenID accessToken */
    accessToken?: string
    accessTokenExpiresAt?: number
    error?: string
    refreshToken?: string
    refreshTokenExpiresAt?: number
  }
}
