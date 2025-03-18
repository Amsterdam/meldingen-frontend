import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import Keycloak from 'keycloak-js'
import { httpClient, keycloakAuthProvider } from 'ra-keycloak'
import { useRef } from 'react'
import type { AuthProvider, DataProvider } from 'react-admin'

import { dataProvider } from './dataProvider'

const initOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
  responseMode: 'query',
}

const config: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

export const useAuthProvider = () => {
  const authProvider = useRef<AuthProvider | undefined>()
  const dataProviderRef = useRef<DataProvider | undefined>()

  const keycloakClient = new Keycloak(config)

  keycloakClient.onTokenExpired = () => {
    keycloakClient.updateToken().catch(() => {
      keycloakClient.login()
    })
  }

  authProvider.current = keycloakAuthProvider(keycloakClient, {
    initOptions,
    loginRedirectUri: `/#/auth-callback`,
    logoutRedirectUri: `/#/login`,
  })

  dataProviderRef.current = dataProvider(import.meta.env.VITE_BACKEND_BASE_URL, httpClient(keycloakClient))

  return { keycloakClient, dataProviderRef, authProvider }
}
