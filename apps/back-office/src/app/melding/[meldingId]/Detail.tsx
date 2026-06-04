import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { DescriptionList, Grid, Heading, Paragraph } from '@meldingen/ui'

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
            <DescriptionList className={styles.cardWide}>
              {additionalQuestionsWithMeldingText.map(({ description, key, term }) => (
                <Fragment key={key}>
                  <DescriptionList.Term>{term}</DescriptionList.Term>
                  <DescriptionList.Description>{description}</DescriptionList.Description>
                </Fragment>
              ))}
            </DescriptionList>
            {location && (
              <DescriptionList className={styles.card}>
                {location.map(({ description, key, term }) => (
                  <Fragment key={key}>
                    <DescriptionList.Term>{term}</DescriptionList.Term>
                    <DescriptionList.Description>{description}</DescriptionList.Description>
                  </Fragment>
                ))}
              </DescriptionList>
            )}
            {contact && (
              <DescriptionList className={styles.card}>
                {contact.map(({ description, key, term }) => (
                  <Fragment key={key}>
                    <DescriptionList.Term>{term}</DescriptionList.Term>
                    <DescriptionList.Description>{description}</DescriptionList.Description>
                  </Fragment>
                ))}
              </DescriptionList>
            )}
            <DescriptionList className={styles.cardTall}>
              {meldingData.map(({ description, key, link, term }) => (
                <Fragment key={key}>
                  <DescriptionList.Term>{term}</DescriptionList.Term>
                  <DescriptionList.Description>{description}</DescriptionList.Description>
                  {link && (
                    <DescriptionList.Description>
                      <AmsNextLink href={link.href} variant="link">
                        {link.label}
                      </AmsNextLink>
                    </DescriptionList.Description>
                  )}
                </Fragment>
              ))}
            </DescriptionList>
            <DescriptionList className={styles.cardWide}>
              <DescriptionList.Term>{t('attachments.title')}</DescriptionList.Term>
              {hasAttachments ? (
                <div>
                  {attachments.files.map((file) => (
                    <DescriptionList.Description className={styles.attachmentsDescription} key={file.fileName}>
                      <AttachmentImage blob={file.blob} fileName={file.fileName} />
                    </DescriptionList.Description>
                  ))}
                </div>
              ) : (
                <DescriptionList.Description>
                  <Paragraph>{t('attachments.no-data')}</Paragraph>
                </DescriptionList.Description>
              )}
            </DescriptionList>
          </div>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
