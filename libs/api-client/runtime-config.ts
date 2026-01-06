import type { CreateClientConfig } from './src/client.gen';

export const createClientConfig: CreateClientConfig = (config) => {
  const isNodeEnv = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
  const isServer = typeof window === 'undefined';

  // If this function does not run in a Node.js environment
  // (like in our Admin Vite app), return the config as is.
  if (!isNodeEnv) return { ...config }

  return {
    ...config,
    baseUrl: isServer
      ? process.env.NEXT_INTERNAL_BACKEND_BASE_URL
      : process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000" // Fallback for automated tests
  };
};
