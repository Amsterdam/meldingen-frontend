import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  base: 'http://localhost:8000',
  client: 'legacy/fetch',
  input: 'http://localhost:8000/openapi.json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './libs/api-client/src',
  },
  plugins: ['@hey-api/schemas', { name: '@hey-api/sdk', operationId: false }],
})
