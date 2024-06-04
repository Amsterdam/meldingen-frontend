import { getSession, signIn } from 'next-auth/react'
import simpleRestProvider from 'ra-data-simple-rest'
import type { DataProvider } from 'react-admin'
import { fetchUtils } from 'react-admin'

const fetchJson = async (url: string, options: fetchUtils.Options = {}) => {
  const session = await getSession()

  if (session?.error === 'RefreshAccessTokenError') {
    signIn()
  }

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

export const dataProvider = (apiUrl = 'http://localhost:8000', httpClient = fetchJson): DataProvider => ({
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
