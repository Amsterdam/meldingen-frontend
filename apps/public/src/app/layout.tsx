import type { Metadata } from 'next'

import { Footer, Header, Screen } from '@meldingen/ui'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  title: 'Meldingen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <Screen maxWidth="wide">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Screen>
      </body>
    </html>
  )
}
