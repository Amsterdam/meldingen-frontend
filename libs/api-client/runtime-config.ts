import type { CreateClientConfig } from './src/client.gen';

export const createClientConfig: CreateClientConfig = (config) => {
  const isServer = typeof window === 'undefined';

  console.log(isServer, process.env.NEXT_INTERNAL_BACKEND_BASE_URL, process.env.NEXT_PUBLIC_BACKEND_BASE_UR)

  return {
    ...config,
    baseUrl: isServer
      ? process.env.NEXT_INTERNAL_BACKEND_BASE_URL
      : process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000" // Fallback for automated tests
  };
};
