import type { CreateClientConfig } from './src/client.gen';

export const createClientConfig: CreateClientConfig = (config) => {
  const isServer = typeof window === 'undefined';

  return {
    ...config,
    baseUrl: isServer
      ? process.env.NEXT_INTERNAL_BACKEND_BASE_URL
      : process.env.NEXT_PUBLIC_BACKEND_BASE_URL || config?.baseUrl // Fallback for automated tests
  };
};
