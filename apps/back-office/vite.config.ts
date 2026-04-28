import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    clearMocks: true,
    coverage: {
      enabled: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      thresholds: {
        branches: 75,
        functions: 79,
        lines: 80,
        statements: 80,
      },
    },
    env: {
      NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:3000',
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
