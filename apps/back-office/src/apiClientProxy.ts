import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from './app/_authentication/authOptions'
import { client } from 'libs/api-client/src/client.gen'

client.setConfig({
  auth: async () => {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken || session.error) {
      redirect('/api/auth/signin')
    }

    return session.accessToken
  },
})

export * from '@meldingen/api-client'
