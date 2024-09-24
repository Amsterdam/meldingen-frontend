import type { Metadata } from 'next'

import { client } from '@meldingen/api-client'
import { Footer, Header, Screen } from '@meldingen/ui'

import { MeldingContextProvider } from '../context/MeldingContextProvider'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  title: 'Meldingen',
}

// Set client on server
client.setConfig({
  baseUrl: 'http://localhost:8000/',
})

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="nl">
    <body>
      <MeldingContextProvider>
        <Screen maxWidth="wide">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Screen>
      </MeldingContextProvider>
    </body>
  </html>
)

export default RootLayout
