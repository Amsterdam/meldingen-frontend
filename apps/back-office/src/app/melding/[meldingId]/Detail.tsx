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
  additionalQuestionsWithMeldingText: MeldingData[]
  contact?: MeldingData[]
  meldingId: number
  metadata: ((MeldingData & { link?: undefined }) | (MeldingData & { link: { href: string; label: string } }))[]
}

export const Detail = ({ additionalQuestionsWithMeldingText, contact, meldingId, metadata }: Props) => {
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
        <DescriptionList className="ams-mb-l">
          {additionalQuestionsWithMeldingText.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
        <DescriptionList className="ams-mb-l">
          {metadata.map(({ key, term, description, link }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
              {link && (
                <DescriptionList.Description>
                  <NextLink href={link.href} passHref legacyBehavior>
                    <Link>{link.label}</Link>
                  </NextLink>
                </DescriptionList.Description>
              )}
            </Fragment>
          ))}
        </DescriptionList>
        {contact && (
          <DescriptionList className="ams-mb-l">
            {contact.map(({ key, term, description }) => (
              <Fragment key={key}>
                <DescriptionList.Term>{term}</DescriptionList.Term>
                <DescriptionList.Description>{description}</DescriptionList.Description>
              </Fragment>
            ))}
          </DescriptionList>
        )}
      </Grid.Cell>
    </Grid>
  )
}
