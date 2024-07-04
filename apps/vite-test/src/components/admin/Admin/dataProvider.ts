// import { getSession, signIn } from 'next-auth/react'
import simpleRestProvider from 'ra-data-simple-rest'
import type { DataProvider } from 'react-admin'
import { fetchUtils } from 'react-admin'

const fetchJson = async (url: string, options: fetchUtils.Options = {}) => {
  // const session = await getSession()

  // if (session?.error === 'RefreshAccessTokenError') {
  //   signIn()
  // }
  console.log('fetch json')

  const customHeaders = (options.headers ||
    new Headers({
      Accept: 'application/json',
    })) as Headers
  // customHeaders.set('Authorization', `Bearer ${session?.accessToken}`)

  const newOptions = {
    ...options,
    headers: customHeaders,
  }

  return fetchUtils.fetchJson(url, newOptions)
}

const customHttpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }
  const token = localStorage.getItem('token')
  options.headers.set('Authorization', `Bearer ${token}`)
  return fetchUtils.fetchJson(url, options)
}

export const dataProvider = (apiUrl = 'http://localhost:8000', httpClient = customHttpClient): DataProvider => ({
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

export const keyCloakTokenDataProviderBuilder = (dataProvider: DataProvider, keycloak: Keycloak) =>
  new Proxy(dataProvider, {
    get: (target, name) => (resource, params) => {
      console.log('keycloak', keycloak)
      if (typeof name === 'symbol' || name === 'then') {
        return
      }
      console.log(`Simulating call to dataprovider.${name}() with keycloak token: ${keycloak.idToken}`)

      return dataProvider[name](resource, params)
    },
  })
