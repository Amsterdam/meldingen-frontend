import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    clearMocks: true,
    coverage: {
      enabled: true,
      exclude: ['src/index.ts'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      thresholds: {
        branches: 91,
        functions: 96,
        lines: 94,
        statements: 94,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
