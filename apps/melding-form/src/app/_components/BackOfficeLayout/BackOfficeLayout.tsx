'use client'

import type { PropsWithChildren } from 'react'

import { HouseFillIcon, PlusCircleFillIcon } from '@amsterdam/design-system-react-icons'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Grid, Menu, Page } from '@meldingen/ui'

import { Header } from './Header'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './BackOfficeLayout.module.css'

// These menu items are duplicated from the Back Office (apps/back-office/src/app/layout.tsx)
// When you update the menu items here, make sure to update them in the Back Office as well.
const MenuItems = () => {
  const t = useTranslations('shared.back-office-menu')

  return [
    <Menu.Link
      href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/`}
      icon={<HouseFillIcon />}
      key="overview"
      linkComponent={NextLink}
    >
      {t('overview')}
    </Menu.Link>,
    <Menu.Link
      href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden`}
      icon={<PlusCircleFillIcon />}
      key="melding-form"
      linkComponent={NextLink}
    >
      {t('melding-form')}
    </Menu.Link>,
  ]
}

export const BackOfficeLayout = ({ children }: PropsWithChildren) => (
  <Page className={`ams-theme ams-theme--compact ${styles.page}`} id={TOP_ANCHOR_ID} withMenu>
    <Header>
      <Menu>
        <MenuItems />
      </Menu>
    </Header>
    <Menu className="ams-page__area--menu" inWideWindow>
      <MenuItems />
    </Menu>
    <Grid className="ams-theme ams-page__area--body" paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </Page>
)
