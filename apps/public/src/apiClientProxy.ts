import * as apiClientProxy from '@meldingen/api-client'

// Set base url for the API client
apiClientProxy.OpenAPI.BASE = 'http://localhost:8000'

export * from '@meldingen/api-client'
