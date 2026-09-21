import { httpClient } from 'ra-keycloak'

import { genericDataProvider } from './genericDataProvider'
import { keycloakInstance } from './keycloakAuthProvider'
import { clientEnv } from '~/env/client'

export const keycloakDataProvider = genericDataProvider(clientEnv.VITE_BACKEND_BASE_URL, httpClient(keycloakInstance))
