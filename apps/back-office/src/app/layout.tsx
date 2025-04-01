import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'

import { authOptions } from './_authentication/authOptions'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'
import './global.css'

export const metadata: Metadata = {
  description: 'Beheer van meldingen over de openbare ruimte',
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions)

  if (session?.error === 'RefreshAccessTokenError') {
    redirect(`${process.env.NEXTAUTH_URL}/api/auth/signin`) // Force sign in to hopefully resolve error
  }

  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
export default RootLayout
