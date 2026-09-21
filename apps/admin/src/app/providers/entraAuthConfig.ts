import type { Configuration } from '@azure/msal-browser'

import { clientEnv } from '~/env/client'

export const entraAuthConfig: Configuration = {
  auth: {
    authority: clientEnv.VITE_ENTRA_AUTHORITY,
    clientId: clientEnv.VITE_ENTRA_CLIENT_ID!,
    navigateToLoginRequestUrl: false,
    OIDCOptions: {
      serverResponseType: 'query',
    },
    redirectUri: `${clientEnv.VITE_ENTRA_APP_BASE_URL}/auth-callback`,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}
