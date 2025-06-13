'use client'

import { Alert, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { FormRenderer } from '@meldingen/form-renderer'

// TODO: fix types
type Props = {
  action: any
  formData: any[]
  previousPanelPath: string
}

const initialState: { message?: string } = {}

export const AdditionalQuestions = ({ action, formData }: Props) => {
  const [formState, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')

  return (
    <>
      {formState?.message && (
        <Alert severity="error" heading="Api Error" headingLevel={2}>
          {formState.message}
        </Alert>
      )}
      <Heading level={1}>{t('step.title')}</Heading>
      <FormRenderer formData={formData} action={formAction} submitButtonText={t('submit-button')} />
    </>
  )
}
