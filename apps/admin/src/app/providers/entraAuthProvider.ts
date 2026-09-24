// Based on: https://github.com/marmelab/ra-auth-msal/tree/main/packages/demo-react-admin

import { PublicClientApplication } from '@azure/msal-browser'
import { msalAuthProvider } from 'ra-auth-msal'

import { entraAuthConfig } from './entraAuthConfig'
import { env } from '~/env/env'

export const msalInstance = new PublicClientApplication(entraAuthConfig)

export const scopes = [`${env.VITE_ENTRA_CLIENT_ID}/.default`, 'openid', 'email']

export const isEntraAuthEnabled =
  Boolean(env.VITE_ENTRA_APP_BASE_URL) && Boolean(env.VITE_ENTRA_AUTHORITY) && Boolean(env.VITE_ENTRA_CLIENT_ID)

export const entraAuthProvider = msalAuthProvider({
  loginRequest: { scopes },
  msalInstance,
  tokenRequest: { scopes },
})
