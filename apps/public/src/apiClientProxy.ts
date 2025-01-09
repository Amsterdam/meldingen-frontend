import * as apiClientProxy from '@meldingen/api-client'

// Set base url for the API client
if (process.env.NEXT_BACKEND_BASE_URL) {
  apiClientProxy.OpenAPI.BASE = process.env.NEXT_BACKEND_BASE_URL
}

export * from '@meldingen/api-client'
