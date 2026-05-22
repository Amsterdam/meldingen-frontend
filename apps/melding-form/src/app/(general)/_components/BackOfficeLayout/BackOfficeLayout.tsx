import type { PropsWithChildren } from 'react'

import { HouseFillIcon, PlusCircleFillIcon } from '@amsterdam/design-system-react-icons'
import { getTranslations } from 'next-intl/server'

import { Grid, Menu, Page } from '@meldingen/ui'

import { Header } from './Header'
import { AmsNextLink } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './BackOfficeLayout.module.css'

const MenuItems = async () => {
  const t = await getTranslations('shared.back-office-menu')

  return [
    <li key="overview">
      <AmsNextLink
        href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/`}
        icon={<HouseFillIcon />}
        variant="menu-link"
      >
        {t('overview')}
      </AmsNextLink>
    </li>,
    <li key="melding-form">
      <AmsNextLink
        href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden`}
        icon={<PlusCircleFillIcon />}
        variant="menu-link"
      >
        {t('melding-form')}
      </AmsNextLink>
    </li>,
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
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </Page>
)
