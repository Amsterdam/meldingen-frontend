import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { Fragment } from 'react'

import { DescriptionList, Grid, Heading, Link, Paragraph } from '@meldingen/ui'

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
  publicId: string
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
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
          <DescriptionList className="ams-mb-l">
            {additionalQuestionsWithMeldingText.map(({ description, key, term }) => (
              <Fragment key={key}>
                <DescriptionList.Term>{term}</DescriptionList.Term>
                <DescriptionList.Description>{description}</DescriptionList.Description>
              </Fragment>
            ))}
          </DescriptionList>
          {location && (
            <DescriptionList className="ams-mb-l">
              {location.map(({ description, key, term }) => (
                <Fragment key={key}>
                  <DescriptionList.Term>{term}</DescriptionList.Term>
                  <DescriptionList.Description>{description}</DescriptionList.Description>
                </Fragment>
              ))}
            </DescriptionList>
          )}
          <DescriptionList className="ams-mb-l">
            {meldingData.map(({ description, key, link, term }) => (
              <Fragment key={key}>
                <DescriptionList.Term>{term}</DescriptionList.Term>
                <DescriptionList.Description>{description}</DescriptionList.Description>
                {link && (
                  <DescriptionList.Description>
                    <NextLink href={link.href} legacyBehavior passHref>
                      <Link>{link.label}</Link>
                    </NextLink>
                  </DescriptionList.Description>
                )}
              </Fragment>
            ))}
          </DescriptionList>
          {contact && (
            <DescriptionList className="ams-mb-l">
              {contact.map(({ description, key, term }) => (
                <Fragment key={key}>
                  <DescriptionList.Term>{term}</DescriptionList.Term>
                  <DescriptionList.Description>{description}</DescriptionList.Description>
                </Fragment>
              ))}
            </DescriptionList>
          )}
          <DescriptionList className={clsx(hasAttachments && styles.attachmentsDescriptionList)}>
            <DescriptionList.Term>{t('attachments.title')}</DescriptionList.Term>
            {hasAttachments ? (
              <div className={clsx(styles.attachmentsGrid, 'ams-mb-l')}>
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
        </Grid.Cell>
      </Grid>
    </div>
  )
}
