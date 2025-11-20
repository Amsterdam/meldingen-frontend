import type { DataProvider, fetchUtils } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'

type HttpClient = (
  url: string,
  options?: fetchUtils.Options,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{ body: string; headers: Headers; json: any; status: number }>

export const dataProvider = (apiUrl: string, httpClient: HttpClient): DataProvider => ({
  ...simpleRestProvider(apiUrl, httpClient),
  update: (resource, params) => {
    // 'form' and 'static-form' updates use PUT requests, all other updates use PATCH requests
    if (resource === 'form' || resource === 'static-form') {
      return httpClient(`${apiUrl}/${resource}/${params.id}`, {
        body: JSON.stringify(params.data),
        method: 'PUT',
      }).then(({ json }) => ({ data: json }))
    }
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      body: JSON.stringify(params.data),
      method: 'PATCH',
    }).then(({ json }) => ({ data: json }))
  },
})
