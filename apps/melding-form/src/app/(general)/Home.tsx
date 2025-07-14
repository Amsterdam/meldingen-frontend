'use client'

import { Alert, Column, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'

import { postPrimaryForm } from './actions'

const initialState: { message?: string } = {}

export const Home = ({ formData }: { formData: StaticFormTextAreaComponentOutput[] }) => {
  const [formState, formAction] = useActionState(postPrimaryForm, initialState)

  const t = useTranslations('homepage')

  return (
    <>
      {formState?.message && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{formState.message}</Paragraph>
        </Alert>
      )}
      <Column aria-labelledby="primary-form-header" as="section" className="ams-mb-m" gap="x-small">
        <Heading aria-hidden id="primary-form-header" level={2} size="level-5">
          {t('title')}
        </Heading>
        <Paragraph>{t('step')}</Paragraph>
      </Column>
      <FormRenderer action={formAction} formData={formData} submitButtonText={t('submit-button')} />
    </>
  )
}
