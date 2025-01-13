import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  title: 'Meldingen',
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="nl">
    <body>{children}</body>
  </html>
)

export default RootLayout
