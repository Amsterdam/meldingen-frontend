import { client } from 'libs/api-client/src/client.gen'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from './app/_authentication/authOptions'

// Dit werkt
client.setConfig({
  auth: async () => {
    console.log('------ nu wordt gecheckt of tokens ok zijn')

    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken || session.error) {
      redirect('/api/auth/signin')
    }

    return session.accessToken
  },
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
})

export * from '@meldingen/api-client'
