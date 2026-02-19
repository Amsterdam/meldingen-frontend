import type { CreateClientConfig } from './src/client.gen';

export const createClientConfig: CreateClientConfig = (config) => {
  const isServer = typeof window === 'undefined';

  // TODO: We should throw an error if the required environment variables are not set

  return {
    ...config,
    baseUrl: isServer
      ? process.env.NEXT_INTERNAL_BACKEND_BASE_URL
      : process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  };
};
