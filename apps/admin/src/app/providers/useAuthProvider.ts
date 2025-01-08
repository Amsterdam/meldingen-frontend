import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import Keycloak from 'keycloak-js'
import { keycloakAuthProvider, httpClient } from 'ra-keycloak'
import { useEffect, useRef, useState } from 'react'
import type { AuthProvider, DataProvider } from 'react-admin'

import { dataProvider } from './dataProvider'

const initOptions: KeycloakInitOptions = { onLoad: 'login-required', checkLoginIframe: false }

const config: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

export const useAuthProvider = () => {
  const [keycloak, setKeycloak] = useState<Keycloak | undefined>()
  const authProvider = useRef<AuthProvider | undefined>()
  const dataProviderRef = useRef<DataProvider | undefined>()

  useEffect(() => {
    // setTimeout is needed to prevent an infinite refresh loop caused by keyCloakClient.init()
    const timerId = setTimeout(() => {
      const initKeyCloakClient = async () => {
        const keycloakClient = new Keycloak(config)

        keycloakClient.onTokenExpired = () => {
          keycloakClient.updateToken().catch(() => {
            keycloakClient.login()
          })
        }

        await keycloakClient.init(initOptions)

        authProvider.current = keycloakAuthProvider(keycloakClient)
        dataProviderRef.current = dataProvider(import.meta.env.VITE_BACKEND_BASE_URL, httpClient(keycloakClient))

        setKeycloak(keycloakClient)
      }
      if (!keycloak) {
        initKeyCloakClient()
      }
    }, 0)

    return () => clearTimeout(timerId)
  }, [keycloak])

  return { keycloak, dataProviderRef, authProvider }
}
