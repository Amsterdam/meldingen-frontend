import { clsx } from 'clsx'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { DescriptionList, Grid, Heading, Link, Paragraph } from '@meldingen/ui'

import { AttachmentImage } from './_components/AttachmentImage'
import { BackLink } from './_components/BackLink'

import styles from './Detail.module.css'

type DescriptionListItem = {
  key: string
  term: string
  description: string
}

type MeldingDataItem = DescriptionListItem & { link?: { href: string; label: string } }

type File = {
  blob: Blob | null
  fileName: string
  error?: string
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

        <DescriptionList className={styles.attachmentsDescriptionList}>
          <DescriptionList.Term>{t('attachments.title')}</DescriptionList.Term>
          {attachments.files.length > 0 ? (
            <div className={clsx(styles.attachmentsGrid, 'ams-mb-l')}>
              {attachments.files.map((file) => (
                <DescriptionList.Description key={file.fileName} className={styles.attachmentsDescription}>
                  <AttachmentImage blob={file.blob} fileName={file.fileName} />
                </DescriptionList.Description>
              ))}
            </div>
          ) : (
            <Paragraph>{t('attachments.no-data')}</Paragraph>
          )}
        </DescriptionList>
      </Grid.Cell>
    </Grid>
  )
}
