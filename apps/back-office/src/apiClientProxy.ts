import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { client } from '@meldingen/api-client'

import { authOptions } from './app/_authentication/authOptions'

client.setConfig({
  auth: async () => {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken || session.error) {
      redirect('/api/auth/signin')
    }

    return session.accessToken
  },
  baseUrl: process.env.NEXT_INTERNAL_BACKEND_BASE_URL,
})

export * from '@meldingen/api-client'
