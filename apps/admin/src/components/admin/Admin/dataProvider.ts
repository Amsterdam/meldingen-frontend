import { getSession } from 'next-auth/react'
import simpleRestProvider from 'ra-data-simple-rest'
import type { DataProvider } from 'react-admin'
import { fetchUtils } from 'react-admin'

const fetchJson = async (url: string, options: fetchUtils.Options = {}) => {
  const session = await getSession()

  const customHeaders = (options.headers ||
    new Headers({
      Accept: 'application/json',
    })) as Headers
  customHeaders.set('Authorization', `Bearer ${session?.accessToken}`)

  const newOptions = {
    ...options,
    headers: customHeaders,
  }

  return fetchUtils.fetchJson(url, newOptions)
}

const baseDataProvider = simpleRestProvider('http://localhost:8000', fetchJson)

export const dataProvider: DataProvider = {
  ...baseDataProvider,
  update: (resource, params) => {
    // 'form' updates use PUT requests, all other updates use PATCH requests
    if (resource === 'form') {
      return fetchJson(`http://localhost:8000/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }))
    }
    return fetchJson(`http://localhost:8000/${resource}/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }))
  },
}
