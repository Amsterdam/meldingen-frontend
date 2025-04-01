import { client } from 'libs/api-client/src/client.gen'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './_authentication/authOptions'
import { Overview } from './Overview'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

export default async () => {
  const session = await getServerSession(authOptions)

  client.setConfig({
    auth: () => session?.accessToken,
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  })

  return <Overview />
}
