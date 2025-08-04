'use client'

import { Alert, FileList, Heading, Paragraph } from '@amsterdam/design-system-react'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { SubmitButton, SummaryList } from '@meldingen/ui'

import { postSummaryForm } from './actions'
import { FormHeader } from '../_components/FormHeader/FormHeader'

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
    files: {
      blob: Blob
      fileName: string
      contentType: string
    }[]
  }
  contact?: GenericSummaryData
  location: GenericSummaryData
  primaryForm: GenericSummaryData
}

const initialState: { errorMessage?: string } = {}

export const Summary = ({ attachments, primaryForm, additionalQuestions, location, contact }: Props) => {
  const [{ errorMessage }, formAction] = useActionState(postSummaryForm, initialState)

  const t = useTranslations('summary')

  return (
    <>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}

      <FormHeader title={t('title')} step={t('step')} />

      <Heading level={1} size="level-4" className="ams-mb-s">
        {t('main-title')}
      </Heading>
      <Paragraph className="ams-mb-m">{t('description')}</Paragraph>

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

        {attachments.files.length > 0 && (
          <SummaryList.Item key={attachments.key}>
            <SummaryList.Term>{attachments.term}</SummaryList.Term>
            <SummaryList.Description key={attachments.key}>
              <FileList className={styles.fileListAttachments}>
                {attachments.files.map(({ fileName, blob, contentType }) => (
                  <FileList.Item key={fileName} file={new File([blob], fileName, { type: contentType })} />
                ))}
              </FileList>
            </SummaryList.Description>
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

      <Form action={formAction} noValidate>
        <SubmitButton>{t('submit-button')}</SubmitButton>
      </Form>
    </>
  )
}
