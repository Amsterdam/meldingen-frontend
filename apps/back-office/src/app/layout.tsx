import type { IconProps } from '@amsterdam/design-system-react'
import type { PropsWithChildren } from 'react'

import { HouseFillIcon } from '@amsterdam/design-system-react-icons'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { Icon, Menu, Page } from '@meldingen/ui'

import { Header } from './_components/Header'

import './global.css'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')

  return {
    description: t('description'),
  }
}

const MenuLinkItem = ({ children, href, icon }: PropsWithChildren<{ href: string; icon: IconProps['svg'] }>) => (
  <li>
    {/*
     * Apply Amsterdam Design System Menu Link styling to NextLink.
     * Using a className avoids issues caused by the `legacyBehavior` prop.
     */}
    <NextLink className="ams-menu__link" href={href}>
      <Icon className="ams-menu__icon" svg={icon} />
      {children}
    </NextLink>
  </li>
)

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
                <MenuLinkItem href="/" icon={<HouseFillIcon />}>
                  {t('menu.overview')}
                </MenuLinkItem>
              </Menu>
            </Header>
            <Menu className="ams-page__area--menu" inWideWindow>
              <MenuLinkItem href="/" icon={<HouseFillIcon />}>
                {t('menu.overview')}
              </MenuLinkItem>
            </Menu>
            {children}
          </Page>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

export default RootLayout
