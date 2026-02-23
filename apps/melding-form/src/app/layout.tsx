import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { client } from '@meldingen/api-client'

import './global.css'
import { ApiClientInitializer } from './ApiClientInitializer'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

// Configure the API client for server requests.
// Client requests are configured in ApiClientInitializer.
client.setConfig({
  baseUrl: process.env.NEXT_INTERNAL_BACKEND_BASE_URL,
})

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()

  return (
    <html dir="ltr" lang={locale}>
      <ApiClientInitializer />
      <NextIntlClientProvider>
        <body>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
