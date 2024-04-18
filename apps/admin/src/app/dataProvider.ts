import { getSession } from 'next-auth/react'
import simpleRestProvider from 'ra-data-simple-rest'
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

export const dataProvider = simpleRestProvider('http://localhost:8000', fetchJson)
