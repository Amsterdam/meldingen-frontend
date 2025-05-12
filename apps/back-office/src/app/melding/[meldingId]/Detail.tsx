'use client'

import { DescriptionList, Grid, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { BackLink } from './_components/BackLink'

type Props = {
  meldingData: { key: string; term: string; description: string }[]
  meldingId: string
}

export const Detail = ({ meldingData, meldingId }: Props) => {
  const t = useTranslations('detail')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink className="ams-mb-s" href={`/`}>
          {t('back-link')}
        </BackLink>
        <Heading level={1} className="ams-mb-m">
          {t('title', { meldingId })}
        </Heading>
        <DescriptionList>
          {meldingData.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
      </Grid.Cell>
    </Grid>
  )
}
