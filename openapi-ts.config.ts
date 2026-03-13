import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:8000/openapi.json',
  output: {
    path: './libs/api-client/src',
    postProcess: ['eslint', 'prettier'],
  },
  plugins: [
    { exportFromIndex: true, name: '@hey-api/client-next' },
    { exportFromIndex: true, name: '@hey-api/schemas' },
    { name: '@hey-api/sdk', operations: { nesting: 'id' } },
  ],
})
