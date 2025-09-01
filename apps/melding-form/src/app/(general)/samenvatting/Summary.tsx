'use client'

import { Heading, Paragraph } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'

import { SubmitButton, SummaryList } from '@meldingen/ui'

import { postSummaryForm } from './actions'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { FormState } from 'apps/melding-form/src/types'

type GenericSummaryData = {
  key: string
  term: string
  description: string[]
}

export type Props = {
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

// Dynamically import AttachmentsSummary to avoid SSR issues with File and Blob
const AttachmentsSummary = dynamic(() => import('./AttachmentsSummary').then((module) => module.AttachmentsSummary), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const initialState: Pick<FormState, 'systemError'> = {}

export const Summary = ({ attachments, primaryForm, additionalQuestions, location, contact }: Props) => {
  const [{ systemError }, formAction] = useActionState(postSummaryForm, initialState)

  const t = useTranslations('summary')

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <main>
      {Boolean(systemError) && <SystemErrorAlert />}
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

        <AttachmentsSummary attachments={attachments} />

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
    </main>
  )
}
