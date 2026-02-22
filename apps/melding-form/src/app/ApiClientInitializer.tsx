'use client'

import { client } from '@meldingen/api-client'

// Configure the API client for client requests.
// Server requests are configured in layout.tsx.
client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
})

export const ApiClientInitializer = () => null
