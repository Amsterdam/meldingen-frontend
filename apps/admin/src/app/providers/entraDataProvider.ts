import type { SilentRequest } from '@azure/msal-browser'

import { msalHttpClient, msalRefreshAuth } from 'ra-auth-msal'
import { addRefreshAuthToDataProvider } from 'react-admin'

import { msalInstance, scopes } from './entraAuthProvider'
import { genericDataProvider } from './genericDataProvider'
import { clientEnv } from '~/env/env'

export const tokenRequest: SilentRequest = {
  forceRefresh: false,
  scopes,
}

const httpClient = msalHttpClient({
  msalInstance,
  tokenRequest,
})

export const entraDataProvider = addRefreshAuthToDataProvider(
  genericDataProvider(clientEnv.VITE_BACKEND_BASE_URL, httpClient),
  msalRefreshAuth({
    msalInstance,
    tokenRequest,
  }),
)
