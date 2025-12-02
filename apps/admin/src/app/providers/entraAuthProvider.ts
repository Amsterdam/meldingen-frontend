// Based on: https://github.com/marmelab/ra-auth-msal/tree/main/packages/demo-react-admin

import { PublicClientApplication } from '@azure/msal-browser'
import { msalAuthProvider } from 'ra-auth-msal'

import { entraAuthConfig } from './entraAuthConfig'

export const msalInstance = new PublicClientApplication(entraAuthConfig)

export const scopes = [`${import.meta.env.VITE_ENTRA_CLIENT_ID}/.default`, 'openid', 'email']

export const entraAuthProvider = msalAuthProvider({
  loginRequest: { scopes },
  msalInstance,
  tokenRequest: { scopes },
})
