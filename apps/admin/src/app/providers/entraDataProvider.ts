import type { SilentRequest } from '@azure/msal-browser'

import { msalHttpClient, msalRefreshAuth } from 'ra-auth-msal'
import simpleRestProvider from 'ra-data-simple-rest'
import { addRefreshAuthToDataProvider } from 'react-admin'

import { msalInstance, scopes } from './entraAuthProvider'

export const tokenRequest: SilentRequest = {
  forceRefresh: false,
  scopes,
}

const httpClient = msalHttpClient({
  msalInstance,
  tokenRequest,
})

export const entraDataProvider = addRefreshAuthToDataProvider(
  simpleRestProvider('http://localhost:8000', httpClient),
  msalRefreshAuth({
    msalInstance,
    tokenRequest,
  }),
)
