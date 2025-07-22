'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import type { Component } from '@meldingen/form-renderer'

import { FormHeader } from '../../../_components/FormHeader/FormHeader'

export type Props = {
  action: (
    _: unknown,
    formData: FormData,
  ) => Promise<{
    errorMessage: string
    formData: FormData
  }>
  formComponents: Component[]
  panelLabel: string
  previousPanelPath: string
}

const initialState: { errorMessage?: string; formData?: FormData } = {}

export const AdditionalQuestions = ({ action, formComponents, panelLabel }: Props) => {
  const [{ formData, errorMessage }, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')

  const prefilledFormComponents = formComponents.map((component) => {
    if (isSelectboxes(component)) {
      const defaultValues = component.values.map(({ value }) => formData?.get(`checkbox___${component.key}___${value}`))

      return { ...component, defaultValues: defaultValues }
    }

    const formValue = formData?.get(component.key)

    if (typeof formValue === 'string') {
      return { ...component, defaultValue: formValue }
    }

    return component
  })

  return (
    <>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}
      <FormHeader title={t('title')} step={t('step')} />
      <FormRenderer
        formComponents={prefilledFormComponents}
        action={formAction}
        panelLabel={panelLabel}
        submitButtonText={t('submit-button')}
      />
    </>
  )
}
