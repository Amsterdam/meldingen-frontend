import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-tokens/dist/compact.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  description: 'Beheer van meldingen over de openbare ruimte',
}

const RootLayout = async ({ children }: PropsWithChildren) => (
  <html lang="nl">
    <body>{children}</body>
  </html>
)

export default RootLayout
