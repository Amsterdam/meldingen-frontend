import { httpClient } from 'ra-keycloak'

import { genericDataProvider } from './genericDataProvider'
import { keycloakInstance } from './keycloakAuthProvider'
import { env } from '~/env/env'

export const keycloakDataProvider = genericDataProvider(env.VITE_BACKEND_BASE_URL, httpClient(keycloakInstance))
