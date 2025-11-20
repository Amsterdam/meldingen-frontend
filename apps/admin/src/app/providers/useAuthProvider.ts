import type { KeycloakConfig } from 'keycloak-js' // KeycloakInitOptions
import type { AuthProvider, DataProvider } from 'react-admin'

import { PublicClientApplication } from '@azure/msal-browser'
import Keycloak from 'keycloak-js'
import { msalAuthProvider } from 'ra-auth-msal'
import { httpClient } from 'ra-keycloak' // keycloakAuthProvider
import { useRef } from 'react'

import { dataProvider } from './dataProvider'

// const initOptions: KeycloakInitOptions = {
//   checkLoginIframe: false,
//   onLoad: 'login-required',
//   responseMode: 'query',
// }

const config: KeycloakConfig = {
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
}

const myMSALObj = new PublicClientApplication({
  auth: {
    authority: import.meta.env.ENTRA_MSAL_AUTHORITY,
    clientId: import.meta.env.ENTRA_CLIENT_ID,
    navigateToLoginRequestUrl: false,
    redirectUri: `http://localhost:3001/auth-callback`,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
})

export const useAuthProvider = () => {
  const authProvider = useRef<AuthProvider | undefined>(undefined)
  const dataProviderRef = useRef<DataProvider | undefined>(undefined)

  const keycloakClient = new Keycloak(config)

  keycloakClient.onTokenExpired = () => {
    keycloakClient.updateToken().catch(() => {
      keycloakClient.login()
    })
  }

  const test = msalAuthProvider({
    // @ts-expect-error dunno
    msalInstance: myMSALObj,
  })

  // authProvider.current = keycloakAuthProvider(keycloakClient, {
  //   initOptions,
  //   loginRedirectUri: `/#/auth-callback`,
  //   logoutRedirectUri: `/#/login`,
  // })

  authProvider.current = test

  dataProviderRef.current = dataProvider(import.meta.env.VITE_BACKEND_BASE_URL, httpClient(keycloakClient))

  return { authProvider, dataProviderRef, keycloakClient }
}
