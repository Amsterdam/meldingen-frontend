// Based on: https://github.com/marmelab/ra-auth-msal/tree/main/packages/demo-react-admin

import { PublicClientApplication } from '@azure/msal-browser'
import { msalAuthProvider } from 'ra-auth-msal'

import { entraAuthConfig } from './entraAuthConfig'
import { clientEnv } from '~/env/clientEnv'

export const msalInstance = new PublicClientApplication(entraAuthConfig)

export const scopes = [`${clientEnv.VITE_ENTRA_CLIENT_ID}/.default`, 'openid', 'email']

export const isEntraAuthEnabled =
  Boolean(clientEnv.VITE_ENTRA_APP_BASE_URL) &&
  Boolean(clientEnv.VITE_ENTRA_AUTHORITY) &&
  Boolean(clientEnv.VITE_ENTRA_CLIENT_ID)

export const entraAuthProvider = msalAuthProvider({
  loginRequest: { scopes },
  msalInstance,
  tokenRequest: { scopes },
})
