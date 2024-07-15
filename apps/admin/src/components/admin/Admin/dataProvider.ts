import simpleRestProvider from 'ra-data-simple-rest'
import type { DataProvider, fetchUtils } from 'react-admin'

type HttpClient = (
  url: string,
  options?: fetchUtils.Options,
) => Promise<{ status: number; headers: Headers; body: string; json: any }>

export const dataProvider = (httpClient: HttpClient, apiUrl = 'http://localhost:8000'): DataProvider => ({
  ...simpleRestProvider(apiUrl, httpClient),
  update: (resource, params) => {
    // 'form' updates use PUT requests, all other updates use PATCH requests
    if (resource === 'form') {
      return httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }))
    }
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }))
  },
})
