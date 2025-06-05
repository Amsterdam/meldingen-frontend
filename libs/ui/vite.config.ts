import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/index.ts'],
      thresholds: {
        branches: 57.14,
        functions: 33.33,
        lines: 58.53,
        statements: 58.53,
      },
    },
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
