import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import Keycloak from 'keycloak-js'
import { keycloakAuthProvider, httpClient } from 'ra-keycloak'
import { useEffect, useRef, useState } from 'react'
import type { AuthProvider, DataProvider } from 'react-admin'

import { dataProvider } from './dataProvider'

const initOptions: KeycloakInitOptions = { onLoad: 'login-required', checkLoginIframe: false }
// TODO: use .env variables
const config: KeycloakConfig = {
  url: 'http://localhost:8002',
  realm: 'meldingen',
  clientId: `meldingen`,
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
        dataProviderRef.current = dataProvider(httpClient(keycloakClient))

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
