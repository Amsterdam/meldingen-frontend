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
        branches: 92,
        functions: 59,
        lines: 90,
        statements: 90,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
