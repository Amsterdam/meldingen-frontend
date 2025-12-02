import type { DataProvider, fetchUtils } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'

type HttpClient = (
  url: string,
  options?: fetchUtils.Options,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{ body: string; headers: Headers; json: any; status: number }>

export const genericDataProvider = (apiUrl: string, httpClient: HttpClient): DataProvider => ({
  ...simpleRestProvider(apiUrl, httpClient),
  update: async (resource, params) => {
    // 'form' and 'static-form' updates use PUT requests, all other updates use PATCH requests
    if (resource === 'form' || resource === 'static-form') {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        body: JSON.stringify(params.data),
        method: 'PUT',
      })
      return { data: json }
    }
    const { json: json_1 } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      body: JSON.stringify(params.data),
      method: 'PATCH',
    })
    return { data: json_1 }
  },
})
