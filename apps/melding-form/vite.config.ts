import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      thresholds: {
        branches: 87.9,
        functions: 82.8,
        lines: 87.2,
        statements: 87.2,
      },
    },
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
