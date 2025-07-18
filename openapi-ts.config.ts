import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:8000/openapi.json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './libs/api-client/src',
  },
  plugins: [
    { name: '@hey-api/client-next', runtimeConfigPath: './libs/api-client/runtime-config.ts' },
    '@hey-api/schemas',
    { name: '@hey-api/sdk', operationId: false },
  ],
})
