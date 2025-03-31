import { client } from 'libs/api-client/src/client.gen'
import { getServerSession } from 'next-auth'
import { PropsWithChildren } from 'react'

import { authOptions } from './authentication/authOptions'

export default async ({ children }: PropsWithChildren) => {
  const session = await getServerSession(authOptions)

  client.setConfig({
    auth: () => session?.accessToken,
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  })

  return children
}
