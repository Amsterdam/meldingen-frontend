'use client'

import { DescriptionList, Grid, Link } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

type MeldingData = {
  key: string
  term: string
  description: string
}

type Props = {
  meldingData: MeldingData[]
  meldingId: number
  meldingState: string
}

export const Detail = ({ meldingData, meldingId, meldingState }: Props) => {
  const t = useTranslations('detail.state')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <DescriptionList className="ams-mb-l">
          {meldingData.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
        <DescriptionList className="ams-mb-l">
          <DescriptionList.Term>{t('term')}</DescriptionList.Term>
          <DescriptionList.Description>{meldingState}</DescriptionList.Description>
          <DescriptionList.Description>
            <NextLink href={`/melding/${meldingId}/wijzig-status`} passHref legacyBehavior>
              <Link>{t('link')}</Link>
            </NextLink>
          </DescriptionList.Description>
        </DescriptionList>
      </Grid.Cell>
    </Grid>
  )
}
