import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { HouseFillIcon, PlusCircleFillIcon } from '@amsterdam/design-system-react-icons'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { Menu, Page } from '@meldingen/ui'

import { AmsNextLink } from './_components/AmsNextLink'
import { Header } from './_components/Header'
import { ApiClientInitializer } from './ApiClientInitializer'

import './global.css'

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

// These menu items are duplicated in the Melding Form Back Office layout (apps/melding-form/src/app/(general)/_components/BackOfficeLayout/BackOfficeLayout.tsx)
// When you update the menu items here, make sure to update them in the Melding Form as well.
const MenuItems = async () => {
  const t = await getTranslations('shared')

  return [
    <li key="overview">
      <AmsNextLink href="/" icon={<HouseFillIcon />} variant="menu-link">
        {t('menu.overview')}
      </AmsNextLink>
    </li>,
    <li key="melding-form">
      <AmsNextLink href="/melden" icon={<PlusCircleFillIcon />} variant="menu-link">
        {t('menu.melding-form')}
      </AmsNextLink>
    </li>,
  ]
}

const RootLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale()

  return (
    <html dir="ltr" lang={locale}>
      <NextIntlClientProvider>
        <body className="ams-theme ams-theme--compact">
          <ApiClientInitializer />
          <Page withMenu>
            <Header>
              <Menu>
                <MenuItems />
              </Menu>
            </Header>
            <Menu className="ams-page__area--menu" inWideWindow>
              <MenuItems />
            </Menu>
            {children}
          </Page>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
