import type { Metadata } from 'next'

import { Footer, Header, Screen } from '@meldingen/ui'

import { Providers } from './providers'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  title: 'Meldingen',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="nl">
    <body>
      <Providers>
        <Screen maxWidth="wide">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Screen>
      </Providers>
    </body>
  </html>
)

export default RootLayout
