import type { CreateClientConfig } from './src/client.gen'

export const createClientConfig: CreateClientConfig = (config) => {
  // @ts-ignore: Vite defines `import.meta.env` at runtime, but TypeScript may not know about it.
  const isVite = Boolean(import.meta.env)
  const isServer = typeof window === 'undefined'

  if (isVite) {
    return { ...config }
  }

  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_BASE_URL environment variable must be set')
  }

  if (isServer && !process.env.NEXT_INTERNAL_BACKEND_BASE_URL) {
    throw new Error('NEXT_INTERNAL_BACKEND_BASE_URL environment variable must be set')
  }

  return {
    ...config,
    baseUrl: isServer ? process.env.NEXT_INTERNAL_BACKEND_BASE_URL : process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  }
}
