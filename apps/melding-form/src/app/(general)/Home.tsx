'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
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
        <Alert headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{formState.message}</Paragraph>
        </Alert>
      )}
      <FormRenderer action={formAction} formData={formData} submitButtonText={t('submit-button')} />
    </>
  )
}
