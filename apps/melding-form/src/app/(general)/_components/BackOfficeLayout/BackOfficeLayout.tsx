import type { PropsWithChildren } from 'react'

import { HouseFillIcon, PlusCircleFillIcon } from '@amsterdam/design-system-react-icons'
import { getTranslations } from 'next-intl/server'

import { Grid, Menu, Page } from '@meldingen/ui'

import { AmsNextLink, Header } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './BackOfficeLayout.module.css'

export const BackOfficeLayout = async ({ children }: PropsWithChildren) => {
  const t = await getTranslations('shared.back-office-menu')

  return (
    <Page className={`ams-theme ams-theme--compact ${styles.page}`} id={TOP_ANCHOR_ID} withMenu>
      <Header>
        <Menu>
          <li>
            <AmsNextLink
              href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/`}
              icon={<HouseFillIcon />}
              variant="menu-link"
            >
              {t('overview')}
            </AmsNextLink>
          </li>
          <li>
            <AmsNextLink
              href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden`}
              icon={<PlusCircleFillIcon />}
              variant="menu-link"
            >
              {t('melding-form')}
            </AmsNextLink>
          </li>
        </Menu>
      </Header>
      <Menu className="ams-page__area--menu" inWideWindow>
        <li>
          <AmsNextLink
            href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/`}
            icon={<HouseFillIcon />}
            variant="menu-link"
          >
            {t('overview')}
          </AmsNextLink>
        </li>
        <li>
          <AmsNextLink
            href={`${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden`}
            icon={<PlusCircleFillIcon />}
            variant="menu-link"
          >
            {t('melding-form')}
          </AmsNextLink>
        </li>
      </Menu>
      <Grid className="ams-theme ams-page__area--body" paddingBottom="x-large" paddingTop="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
          {children}
        </Grid.Cell>
      </Grid>
    </Page>
  )
}
