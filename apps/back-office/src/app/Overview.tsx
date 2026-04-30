import type { MeldingOutput } from '~/apiClientProxy'

import { useTranslations } from 'next-intl'

import { Grid, Heading } from '@meldingen/ui'

import { OverviewDesktop } from './_components/OverviewDesktop'
import { OverviewMobile } from './_components/OverviewMobile'
import { Pagination } from './_components/Pagination'
import { getShortNLAddress } from './utils'

export type MeldingWithAddress = MeldingOutput & { address?: string }

type Props = {
  meldingen: MeldingOutput[]
  meldingenCount: number
  page?: number
  pageSize: number
  totalPages: number
}

const toMeldingenWithAddress = (meldingen: MeldingOutput[]): MeldingWithAddress[] =>
  meldingen.map((melding) => ({
    ...melding,
    address: getShortNLAddress(melding),
  }))

export const Overview = ({ meldingen, meldingenCount, page, pageSize, totalPages }: Props) => {
  const t = useTranslations()

  const meldingenWithAddress = toMeldingenWithAddress(meldingen)

  return (
    <Grid as="main" className="ams-page__area--body" paddingVertical="x-large">
      <Grid.Cell span="all">
        <Heading className="ams-mb-m" level={1}>
          {t('overview.title', { meldingenCount })}
        </Heading>
        <OverviewMobile meldingen={meldingenWithAddress} />
        <OverviewDesktop meldingen={meldingenWithAddress} />
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </Grid.Cell>
    </Grid>
  )
}
