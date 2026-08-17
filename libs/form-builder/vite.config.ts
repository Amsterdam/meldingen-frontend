import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      enabled: true,
      exclude: ['src/index.ts'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      thresholds: {
        branches: 94,
        functions: 96,
        lines: 98,
        statements: 98,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
