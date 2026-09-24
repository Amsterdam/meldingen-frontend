import type { Configuration } from '@azure/msal-browser'

import { env } from '~/env/env'

export const entraAuthConfig: Configuration = {
  auth: {
    authority: env.VITE_ENTRA_AUTHORITY,
    clientId: env.VITE_ENTRA_CLIENT_ID!,
    navigateToLoginRequestUrl: false,
    OIDCOptions: {
      serverResponseType: 'query',
    },
    redirectUri: `${env.VITE_ENTRA_APP_BASE_URL}/auth-callback`,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}
