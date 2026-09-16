'use client'

import { client } from '@meldingen/api-client'

import { clientEnv } from '~/env/client'

export const ApiClientInitializer = () => {
  if (!clientEnv.NEXT_PUBLIC_BACKEND_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_BASE_URL environment variable must be set')
  }

  // Configure the API client for client requests.
  // Server requests are configured in layout.tsx for requests that pass through layout.tsx,
  // and in route.ts for requests that pass through route handlers.
  client.setConfig({
    baseUrl: clientEnv.NEXT_PUBLIC_BACKEND_BASE_URL,
  })

  return null
}
