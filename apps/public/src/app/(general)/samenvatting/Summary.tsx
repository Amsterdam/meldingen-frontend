'use client'

import { FileList, Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import { SubmitButton, SummaryList } from '@meldingen/ui'

import { postSummaryForm } from './actions'

import styles from './Summary.module.css'

type GenericSummaryData = {
  key: string
  term: string
  description: string[]
}

type Props = {
  additionalQuestions: GenericSummaryData[]
  attachments: {
    key: string
    term: string
    data: {
      file: Blob
      meta: {
        originalFilename: string
        contentType: string
      }
    }[]
  }
  contact?: GenericSummaryData
  location: GenericSummaryData
  primaryForm: GenericSummaryData
}

const initialState: { message?: string } = {}

export const Summary = ({ attachments, primaryForm, additionalQuestions, location, contact }: Props) => {
  const [formState, formAction] = useActionState(postSummaryForm, initialState)

  const [fileList, setFileList] = useState<File[]>([])

  useEffect(() => {
    if (attachments.data.length > 0) {
      const fileList = attachments.data.map((attachment) => {
        return new File([attachment.file], attachment.meta.originalFilename, { type: attachment.meta.contentType })
      })

      setFileList(fileList)
    }
  }, [attachments])

  const t = useTranslations('summary')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <Heading className="ams-mb-s" level={1}>
          {t('step.title')}
        </Heading>

        <Heading level={2} size="level-4" className="ams-mb-xs">
          {t('title')}
        </Heading>
        <Paragraph className="ams-mb-s">{t('description')}</Paragraph>

        {formState?.message && <Paragraph>{formState.message}</Paragraph>}

        <SummaryList className="ams-mb-m">
          <SummaryList.Item key={primaryForm.key}>
            <SummaryList.Term>{primaryForm.term}</SummaryList.Term>
            {primaryForm.description.map((item) => (
              <SummaryList.Description key={item}>{item}</SummaryList.Description>
            ))}
          </SummaryList.Item>

          {additionalQuestions.length > 0 &&
            additionalQuestions.map(({ key, term, description }) => (
              <SummaryList.Item key={key}>
                <SummaryList.Term>{term}</SummaryList.Term>
                {description.map((item) => (
                  <SummaryList.Description key={item}>{item}</SummaryList.Description>
                ))}
              </SummaryList.Item>
            ))}

          <SummaryList.Item key={location.key}>
            <SummaryList.Term>{location.term}</SummaryList.Term>
            {location.description.map((item) => (
              <SummaryList.Description key={item}>{item}</SummaryList.Description>
            ))}
          </SummaryList.Item>

          {fileList.length > 0 && (
            <SummaryList.Item key={attachments.key} className={styles.fileListItemAttachments}>
              <SummaryList.Term>{attachments.term}</SummaryList.Term>
              <FileList>
                {fileList.map((file) => (
                  <FileList.Item key={file.name} file={file} />
                ))}
              </FileList>
            </SummaryList.Item>
          )}

          {contact && (
            <SummaryList.Item key={contact.key}>
              <SummaryList.Term>{contact.term}</SummaryList.Term>
              {contact.description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
            </SummaryList.Item>
          )}
        </SummaryList>

        <form action={formAction}>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
