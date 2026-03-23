import type { DataProvider, fetchUtils } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'

type HttpClient = (
  url: string,
  options?: fetchUtils.Options,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{ body: string; headers: Headers; json: any; status: number }>

export const genericDataProvider = (apiUrl: string, httpClient: HttpClient): DataProvider => ({
  ...simpleRestProvider(apiUrl, httpClient),

  getList: async (resource, params) => {
    // Allow callers to override the page size via `meta.limit` (e.g. when loading options for a select).
    const limitValue = params.meta?.limit ?? params.pagination?.perPage ?? 50
    const limit = JSON.stringify(limitValue)

    const searchParams = {
      filter: JSON.stringify(params.filter),
      limit,
      offset: JSON.stringify(params.pagination ? (params.pagination.page - 1) * params.pagination.perPage : 0),
      sort: JSON.stringify([params.sort?.field, params.sort?.order]),
    }

    const url = `${apiUrl}/${resource}?${new URLSearchParams(searchParams)}`

    return httpClient(url).then((response) => {
      const total = response.headers.get('Content-Range')?.split('/')[1]

      if (!total) {
        throw new Error('Content-Range header is missing in the response. Total count cannot be determined.')
      }

      return { data: response.json, total: parseInt(total, 10) }
    })
  },

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
