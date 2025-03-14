import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { NextAuthProvider } from './providers'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  description: 'Beheer van meldingen over de openbare ruimte',
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="nl">
    <NextAuthProvider>
      <body>{children}</body>
    </NextAuthProvider>
  </html>
)

export default RootLayout
