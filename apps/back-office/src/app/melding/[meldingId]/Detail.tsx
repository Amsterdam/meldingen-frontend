import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { Column, Grid, Heading, Paragraph } from '@meldingen/ui'

import type { MeldingOutput } from '~/app/_api-client/proxy'

import { AmsNextLink } from '../../_components/AmsNextLink'
import { AttachmentImage } from './_components/AttachmentImage'
import { BackLink } from './_components/BackLink'

import styles from './Detail.module.css'

type DescriptionListItem = {
  description: string
  key: string
  term: string
}

type MeldingDataItem = DescriptionListItem & { link?: { href: string; label: string } }

type File = {
  blob: Blob | null
  error?: string
  fileName: string
}

type Props = {
  additionalQuestionsWithMeldingText: DescriptionListItem[]
  attachments: Omit<DescriptionListItem, 'description'> & { files: File[] }
  contact?: DescriptionListItem[]
  location?: DescriptionListItem[]
  meldingData: MeldingDataItem[]
  publicId: MeldingOutput['public_id']
}

export const Detail = ({
  additionalQuestionsWithMeldingText,
  attachments,
  contact,
  location,
  meldingData,
  publicId,
}: Props) => {
  const t = useTranslations('detail')

  const hasAttachments = attachments.files.length > 0

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/`}>{t('back-link')}</BackLink>
      <Grid as="main">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
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
                      <AmsNextLink href={link.href} variant="link">
                        {link.label}
                      </AmsNextLink>
                    </dd>
                  )}
                </Fragment>
              ))}
            </dl>
            <dl className={clsx(styles.descriptionList, styles.cardWide)}>
              <dt className={styles.term}>{t('attachments.title')}</dt>
              {hasAttachments ? (
                <div className={styles.attachmentsGrid}>
                  {attachments.files.map((file) => (
                    <dd
                      className={clsx(styles.horizontalDescription, styles.attachmentsDescription)}
                      key={file.fileName}
                    >
                      <AttachmentImage blob={file.blob} fileName={file.fileName} />
                    </dd>
                  ))}
                </div>
              ) : (
                <dd className={styles.horizontalDescription}>
                  <Paragraph>{t('attachments.no-data')}</Paragraph>
                </dd>
              )}
            </dl>
          </div>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
