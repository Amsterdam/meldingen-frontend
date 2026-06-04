import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { client } from '@meldingen/api-client'

import { authOptions } from '../_authentication/authOptions'

client.interceptors.error.use((error) => {
  // Re-throw Next.js redirect errors so the client's catch block doesn't swallow them
  if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
  return error
})

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
