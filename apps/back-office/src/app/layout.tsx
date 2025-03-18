import type { Metadata } from 'next'
// import { getServerSession } from 'next-auth/next'
import type { ReactNode } from 'react'

import { auth } from './api/auth/[...nextauth]'
import { NextAuthProvider } from './providers'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  description: 'Beheer van meldingen over de openbare ruimte',
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  // const session = await getServerSession()
  const session = await auth()
  console.log('--- session SERVER:', session)

  return (
    <html lang="nl">
      <NextAuthProvider>
        <body>{children}</body>
      </NextAuthProvider>
    </html>
  )
}

export default RootLayout
