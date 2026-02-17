import type { PropsWithChildren } from 'react'

import { HouseFillIcon } from '@amsterdam/design-system-react-icons'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { Menu, Page } from '@meldingen/ui'

import { Header } from './_components/Header'

import './global.css'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

const RootLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale()

  const t = await getTranslations('shared')

  return (
    <html dir="ltr" lang={locale}>
      <NextIntlClientProvider>
        <body>
          <Page withMenu>
            <Header>
              <Menu>
                <NextLink href="/" legacyBehavior passHref>
                  <Menu.Link href="/" icon={<HouseFillIcon />}>
                    {t('menu.overview')}
                  </Menu.Link>
                </NextLink>
              </Menu>
            </Header>
            <Menu className="ams-page__area--menu" inWideWindow>
              <NextLink href="/" legacyBehavior passHref>
                <Menu.Link href="/" icon={<HouseFillIcon />}>
                  {t('menu.overview')}
                </Menu.Link>
              </NextLink>
            </Menu>
            {children}
          </Page>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
