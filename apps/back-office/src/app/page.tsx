import { client } from 'libs/api-client/src/client.gen'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'

import { getMelding } from '@meldingen/api-client'

import { authOptions } from './_authentication/authOptions'
import { Overview } from './Overview'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

export default async () => {
  const session = await getServerSession(authOptions)

  console.log('session errors: ', session?.error)

  if (!session?.accessToken) {
    // TODO: what should we return here?
    return <div>Je bent niet ingelogd</div>
  }

  client.setConfig({
    auth: () => session.accessToken,
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  })

  const { data } = await getMelding()

  return <Overview data={data} />
}
