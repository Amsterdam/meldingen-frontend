import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { HouseFillIcon, PlusCircleFillIcon } from '@amsterdam/design-system-react-icons'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { Menu, Page } from '@meldingen/ui'

import { ApiClientInitializer } from './_api-client/ApiClientInitializer'
import { AmsNextLink } from './_components/AmsNextLink'
import { Header } from './_components/Header'

import './global.css'

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

const RootLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale()

  const t = await getTranslations('shared')

  // These menu items are duplicated in the Melding Form Back Office layout (apps/melding-form/src/app/_components/BackOfficeLayout/BackOfficeLayout.tsx)
  // When you update the menu items here, make sure to update them in the Melding Form as well.
  const menuItems = [
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

  return (
    <html dir="ltr" lang={locale}>
      <NextIntlClientProvider>
        <body className="ams-theme ams-theme--compact">
          <ApiClientInitializer />
          <Page withMenu>
            <Header>
              <Menu>{menuItems}</Menu>
            </Header>
            <Menu className="ams-page__area--menu" inWideWindow>
              {menuItems}
            </Menu>
            {children}
          </Page>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
