import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import type { AuthProvider, DataProvider } from 'react-admin'

import Keycloak from 'keycloak-js'
import { httpClient, keycloakAuthProvider } from 'ra-keycloak'
import { useRef } from 'react'

import { genericDataProvider } from './genericDataProvider'

const initOptions: KeycloakInitOptions = {
  checkLoginIframe: false,
  onLoad: 'login-required',
  responseMode: 'query',
}

const config: KeycloakConfig = {
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
}

export const useAuthProvider = () => {
  const authProvider = useRef<AuthProvider | undefined>(undefined)
  const dataProviderRef = useRef<DataProvider | undefined>(undefined)

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

  dataProviderRef.current = genericDataProvider(import.meta.env.VITE_BACKEND_BASE_URL, httpClient(keycloakClient))

  return { authProvider, dataProviderRef, keycloakClient }
}
