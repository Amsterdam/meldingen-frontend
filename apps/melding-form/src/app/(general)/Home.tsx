'use client'

import { Alert } from '@amsterdam/design-system-react'
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
        <Alert severity="error" heading="Api Error" headingLevel={2}>
          {formState.message}
        </Alert>
      )}
      <FormRenderer action={formAction} formData={formData} submitButtonText={t('submit-button')} />
    </>
  )
}
