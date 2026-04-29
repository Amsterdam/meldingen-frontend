'use client'

import { client } from '@meldingen/api-client'

export const ApiClientInitializer = () => {
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_BASE_URL environment variable must be set')
  }

  // Configure the API client for client requests.
  // Server requests are configured in layout.tsx for requests that pass through layout.tsx,
  // and in route.ts for requests that pass through route handlers.
  client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  })

  return null
}
