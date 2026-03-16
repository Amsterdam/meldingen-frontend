import type { DataProvider, fetchUtils } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'

type HttpClient = (
  url: string,
  options?: fetchUtils.Options,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{ body: string; headers: Headers; json: any; status: number }>

export const genericDataProvider = (apiUrl: string, httpClient: HttpClient): DataProvider => ({
  ...simpleRestProvider(apiUrl, httpClient),

  // getList: async (resource, params) => {
  //   const queryParams = {
  //     filter: JSON.stringify(params.filter),
  //     sort: JSON.stringify([params.sort?.field, params.sort?.order]),
  //     ...(params.meta?.limit && { limit: params.meta.limit }),
  //   }

  //   const url = `${apiUrl}/${resource}/?${new URLSearchParams(queryParams)}`
  //   return httpClient(url).then(({ json }) => ({ data: json, total: json.length }))
  // },

  update: async (resource, params) => {
    // 'form' and 'static-form' updates use PUT requests, all other updates use PATCH requests
    if (resource === 'form' || resource === 'static-form') {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        body: JSON.stringify(params.data),
        method: 'PUT',
      })

      return { data: json }
    }

    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      body: JSON.stringify(params.data),
      method: 'PATCH',
    })

    return { data: json }
  },
})
