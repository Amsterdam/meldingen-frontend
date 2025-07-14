'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { FormRenderer } from '@meldingen/form-renderer'

import { FormHeader } from '../../../_components/FormHeader/FormHeader'

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
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{formState.message}</Paragraph>
        </Alert>
      )}
      <FormHeader title={t('title')} step={t('step')} />
      <FormRenderer formData={formData} action={formAction} submitButtonText={t('submit-button')} />
    </>
  )
}
