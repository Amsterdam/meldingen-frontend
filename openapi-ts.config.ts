import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'http://localhost:8000/openapi.json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './libs/api-client/src',
  },
  services: {
    operationId: false,
  },
})
