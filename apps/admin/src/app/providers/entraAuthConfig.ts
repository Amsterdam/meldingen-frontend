import { Configuration } from '@azure/msal-browser'

export const entraAuthConfig: Configuration = {
  auth: {
    authority: import.meta.env.VITE_ENTRA_AUTHORITY,
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    navigateToLoginRequestUrl: false,
    OIDCOptions: {
      serverResponseType: 'query',
    },
    redirectUri: `${import.meta.env.VITE_ENTRA_APP_BASE_URL}/auth-callback`,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}
