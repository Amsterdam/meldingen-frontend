import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'

import Keycloak from 'keycloak-js'
import { keycloakAuthProvider as raKeycloakAuthProvider } from 'ra-keycloak'

import { env } from '~/env/env'

const config: KeycloakConfig = {
  clientId: env.VITE_KEYCLOAK_CLIENT_ID!,
  realm: env.VITE_KEYCLOAK_REALM!,
  url: env.VITE_KEYCLOAK_BASE_URL!,
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
