import type { CreateClientConfig } from './src/client.gen';

export const createClientConfig: CreateClientConfig = (config) => {
  const isServer = typeof window === 'undefined';

  console.log('calling create client config', process.env.NEXT_BACKEND_BASE_URL, process.env.NEXT_PUBLIC_BACKEND_BASE_URL)

  return {
    ...config,
    baseUrl: isServer
      ? process.env.NEXT_BACKEND_BASE_URL
      : process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  };
};
