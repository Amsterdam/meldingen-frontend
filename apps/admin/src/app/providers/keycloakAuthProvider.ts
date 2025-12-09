import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'

import Keycloak from 'keycloak-js'
import { keycloakAuthProvider as raKeycloakAuthProvider } from 'ra-keycloak'

const config: KeycloakConfig = {
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
}

export const keycloakInstance = new Keycloak(config)

keycloakInstance.onTokenExpired = () => {
  keycloakInstance.updateToken().catch(() => {
    keycloakInstance.login()
  })
}

const initOptions: KeycloakInitOptions = {
  checkLoginIframe: false,
  onLoad: 'login-required',
}

export const keycloakAuthProvider = raKeycloakAuthProvider(keycloakInstance, { initOptions })
