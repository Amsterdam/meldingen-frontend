import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import './global.css'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()

  return (
    <html dir="ltr" lang={locale}>
      <NextIntlClientProvider>
        <body>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
