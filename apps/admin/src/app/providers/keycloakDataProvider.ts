import { httpClient } from 'ra-keycloak'

import { genericDataProvider } from './genericDataProvider'
import { keycloakInstance } from './keycloakAuthProvider'

export const keycloakDataProvider = genericDataProvider(
  import.meta.env.VITE_BACKEND_BASE_URL,
  httpClient(keycloakInstance),
)
