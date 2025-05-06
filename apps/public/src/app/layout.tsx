import { client } from 'libs/api-client/src/client.gen'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
})

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <NextIntlClientProvider>
        <body>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
