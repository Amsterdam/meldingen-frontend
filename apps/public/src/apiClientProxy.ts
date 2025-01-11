import * as apiClientProxy from '@meldingen/api-client'

// Set base url for the API client used on the NextJS server
if (process.env.BACKEND_BASE_URL) {
  apiClientProxy.OpenAPI.BASE = process.env.BACKEND_BASE_URL
}

export * from '@meldingen/api-client'
