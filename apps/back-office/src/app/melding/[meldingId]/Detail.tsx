import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { DescriptionList, Grid, Heading, Link } from '@meldingen/ui'

import { BackLink } from './_components/BackLink'

type DescriptionListItem = {
  key: string
  term: string
  description: string
}

type MeldingDataItem = DescriptionListItem & { link?: { href: string; label: string } }

type Props = {
  additionalQuestionsWithMeldingText: DescriptionListItem[]
  contact?: DescriptionListItem[]
  location?: DescriptionListItem[]
  meldingData: MeldingDataItem[]
  publicId: string
}

export const Detail = ({ additionalQuestionsWithMeldingText, contact, location, meldingData, publicId }: Props) => {
  const t = useTranslations('detail')

  return (
    <Grid paddingBottom="2x-large" paddingTop="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink className="ams-mb-s" href={`/`}>
          {t('back-link')}
        </BackLink>
        <Heading level={1} className="ams-mb-m">
          {t('title', { publicId })}
        </Heading>
        <DescriptionList className="ams-mb-l">
          {additionalQuestionsWithMeldingText.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
        {location && (
          <DescriptionList className="ams-mb-l">
            {location.map(({ key, term, description }) => (
              <Fragment key={key}>
                <DescriptionList.Term>{term}</DescriptionList.Term>
                <DescriptionList.Description>{description}</DescriptionList.Description>
              </Fragment>
            ))}
          </DescriptionList>
        )}
        <DescriptionList className="ams-mb-l">
          {meldingData.map(({ key, term, description, link }) => (
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
