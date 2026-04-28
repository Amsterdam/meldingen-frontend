import { client } from '@meldingen/api-client'

export const register = () => {
  // Configure the API client for server requests.
  // Client requests are configured in ApiClientInitializer.
  client.setConfig({ baseUrl: process.env.NEXT_INTERNAL_BACKEND_BASE_URL })
}
