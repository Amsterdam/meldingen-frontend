import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { Fragment } from 'react'

import { Column, Grid, Heading, Link, TabNavigation } from '@meldingen/ui'

import type { GetAttachmentsDataResult } from './_utils/getAttachmentsData'
import type { AssetOutput, MeldingOutput } from '~/app/_api-client/proxy'

import { AttachmentSection } from './_components/AttachmentSection'
import { BackLink } from './_components/BackLink'

import styles from './Detail.module.css'

type DescriptionListItem = {
  description?: string
  key: string
  term: string
}

type MeldingDataItem = DescriptionListItem & { link?: { href: string; label: string } }

type Props = {
  additionalQuestionsWithMeldingText: DescriptionListItem[]
  assets: AssetOutput[]
  assetsTerm?: string
  attachments: GetAttachmentsDataResult
  contact?: DescriptionListItem[]
  location?: DescriptionListItem[]
  meldingData: MeldingDataItem[]
  meldingId: number
  publicId: MeldingOutput['public_id']
}

export const Detail = ({
  additionalQuestionsWithMeldingText,
  assets,
  assetsTerm,
  attachments,
  contact,
  location,
  meldingData,
  meldingId,
  publicId,
}: Props) => {
  const t = useTranslations('detail')

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/`}>{t('back-link')}</BackLink>
      <Grid as="main">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-l" level={1}>
            {t('title', { publicId })}
          </Heading>
          <TabNavigation className="ams-mb-l">
            <TabNavigation.List>
              <TabNavigation.Link aria-current="page" href={`/melding/${meldingId}`} linkComponent={NextLink}>
                {t('tab-navigation.detail')}
              </TabNavigation.Link>
              <TabNavigation.Link href={`/melding/${meldingId}/notities`} linkComponent={NextLink}>
                {t('tab-navigation.notes')}
              </TabNavigation.Link>
            </TabNavigation.List>
          </TabNavigation>
          <div className={styles.cardGrid}>
            <dl className={clsx(styles.descriptionList, styles.cardWide)}>
              {additionalQuestionsWithMeldingText.map(({ description, key, term }) => (
                <Column gap="x-small" key={key}>
                  <dt className={styles.term}>{term}</dt>
                  <dd className={styles.description}>{description}</dd>
                </Column>
              ))}
            </dl>
            {location && (
              <dl className={clsx(styles.horizontalDescriptionList, styles.card)}>
                {location.map(({ description, key, term }) => (
                  <Fragment key={key}>
                    <dt className={styles.term}>{term}</dt>
                    <dd className={styles.horizontalDescription}>{description}</dd>
                  </Fragment>
                ))}
                {assets.length > 0 && (
                  <>
                    <dt className={styles.term}>{assetsTerm ?? t('assets.term')}</dt>
                    {assets.map((asset) => (
                      <dd className={styles.assetsDescription} key={asset.id}>
                        {asset.external_id}
                      </dd>
                    ))}
                  </>
                )}
              </dl>
            )}
            {contact && (
              <dl className={clsx(styles.horizontalDescriptionList, styles.card)}>
                {contact.map(({ description, key, term }) => (
                  <Fragment key={key}>
                    <dt className={styles.term}>{term}</dt>
                    <dd className={styles.horizontalDescription}>{description}</dd>
                  </Fragment>
                ))}
              </dl>
            )}
            <dl className={clsx(styles.horizontalDescriptionList, styles.cardTall)}>
              {meldingData.map(({ description, key, link, term }) => (
                <Fragment key={key}>
                  <dt className={styles.term}>{term}</dt>
                  <dd className={styles.horizontalDescription}>{description}</dd>
                  {link && (
                    <dd className={styles.horizontalLink}>
                      <Link href={link.href} linkComponent={NextLink}>
                        {link.label}
                      </Link>
                    </dd>
                  )}
                </Fragment>
              ))}
            </dl>
            <AttachmentSection attachments={attachments} meldingId={meldingId} />
          </div>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
