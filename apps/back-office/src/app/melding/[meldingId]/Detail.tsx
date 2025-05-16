'use client'

import { DescriptionList, Grid, Heading, Link } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { BackLink } from './_components/BackLink'

type MeldingData = {
  key: string
  term: string
  description: string
}

type Props = {
  meldingData: MeldingData[]
  publicId: string
  meldingId: number
  meldingState: string
}

export const Detail = ({ meldingData, publicId, meldingId, meldingState }: Props) => {
  const t = useTranslations('detail')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink className="ams-mb-s" href={`/`}>
          {t('back-link')}
        </BackLink>
        <Heading level={1} className="ams-mb-m">
          {t('title', { publicId })}
        </Heading>
        <DescriptionList className="ams-mb-l">
          {meldingData.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
        <DescriptionList className="ams-mb-l">
          <DescriptionList.Term>{t('state.term')}</DescriptionList.Term>
          <DescriptionList.Description>{meldingState}</DescriptionList.Description>
          <DescriptionList.Description>
            <NextLink href={`/melding/${meldingId}/wijzig-status`} passHref legacyBehavior>
              <Link>{t('state.link')}</Link>
            </NextLink>
          </DescriptionList.Description>
        </DescriptionList>
      </Grid.Cell>
    </Grid>
  )
}
