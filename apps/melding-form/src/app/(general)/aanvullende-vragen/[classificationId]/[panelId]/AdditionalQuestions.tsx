'use client'

import { Alert, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import type { Component } from '@meldingen/form-renderer'

import { FormHeader } from '../../../_components/FormHeader/FormHeader'

// TODO: fix types
export type Props = {
  action: any
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

  const hasMoreThanOneFormComponent = formComponents.length > 1

  return (
    <>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}
      <FormHeader title={t('title')} step={t('step')} />
      {/*
       * If the page has only one form component, the label or legend of that component is enclosed in an h1 tag in the FormRenderer.
       * If the page has more than one form component, the h1 is rendered here.
       * */}
      {hasMoreThanOneFormComponent && (
        <Heading level={1} size="level-4" className="ams-mb-m">
          {panelLabel}
        </Heading>
      )}
      <FormRenderer
        formComponents={prefilledFormComponents}
        action={formAction}
        submitButtonText={t('submit-button')}
      />
    </>
  )
}
