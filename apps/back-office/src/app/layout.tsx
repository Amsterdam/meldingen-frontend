import type { PropsWithChildren } from 'react'

import { HouseFillIcon } from '@amsterdam/design-system-react-icons'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { Menu, Page, PageHeader } from '@meldingen/ui'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-tokens/dist/compact.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'
import './global.css'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

const RootLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale()

  return (
    <html dir="ltr" lang={locale}>
      <NextIntlClientProvider>
        <body>
          <Page withMenu>
            <PageHeader brandName="Meldingen" className="ams-page__area--header" noMenuButtonOnWideWindow>
              <Menu>
                <Menu.Link href="/" icon={<HouseFillIcon />}>
                  Overzicht
                </Menu.Link>
              </Menu>
            </PageHeader>
            <Menu className="ams-page__area--menu" inWideWindow>
              <Menu.Link href="/" icon={<HouseFillIcon />}>
                Overzicht
              </Menu.Link>
            </Menu>
            {children}
          </Page>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
