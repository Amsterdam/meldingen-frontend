import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  description: 'Maak een melding van een probleem in de openbare ruimte.',
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <body>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
