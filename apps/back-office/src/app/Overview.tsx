'use client'

import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { Grid, Heading, Pagination } from '@meldingen/ui'

import type { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import { OverviewDesktop } from './_components/OverviewDesktop'
import { OverviewMobile } from './_components/OverviewMobile'
import { getShortNLAddress } from './utils'

import styles from './Overview.module.css'

export type MeldingWithAddress = MeldingOutput & { address?: string }

type Props = {
  meldingen: MeldingOutput[]
  meldingenCount: number
  page?: number
  totalPages: number
}

export const toMeldingenWithAddress = (meldingen: MeldingOutput[]): MeldingWithAddress[] =>
  meldingen.map((melding) => ({
    ...melding,
    address: getShortNLAddress(melding),
  }))

export const LinkComponent = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <NextLink href={props.href || ''} legacyBehavior passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
    <a {...props} />
  </NextLink>
)

export const Overview = ({ meldingen, meldingenCount, page, totalPages }: Props) => {
  const t = useTranslations()

  const isWideWindow = useIsAfterBreakpoint('wide')

  const meldingenWithAddress = toMeldingenWithAddress(meldingen)

  return (
    <Grid as="main" className="ams-page__area--body" paddingVertical="x-large">
      <Grid.Cell span="all">
        <Heading className="ams-mb-m" level={1}>
          {t('overview.title', { meldingenCount })}
        </Heading>

        {isWideWindow ? (
          <OverviewDesktop meldingen={meldingenWithAddress} t={t} />
        ) : (
          <OverviewMobile meldingen={meldingenWithAddress} />
        )}

        <Pagination
          className={styles.pagination}
          linkComponent={LinkComponent}
          linkTemplate={(page) => (page === 1 ? '/' : `/?pagina=${page}`)}
          page={page}
          totalPages={totalPages}
        />
      </Grid.Cell>
    </Grid>
  )
}
