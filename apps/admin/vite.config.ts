import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 3001,
  },
  test: {
    coverage: {
      enabled: true,
      thresholds: {
        branches: 79,
        functions: 59,
        lines: 90,
        statements: 90,
      },
    },
    env: {
      // These environment variables are required in the API client runtime config.
      // The imports in filterFormResponse.ts call the runtime config, although they don't use the baseUrl themselves.
      NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:3000',
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
