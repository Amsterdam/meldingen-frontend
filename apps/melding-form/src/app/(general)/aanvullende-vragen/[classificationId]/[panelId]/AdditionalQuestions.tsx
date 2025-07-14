'use client'

import { Alert, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import type { Component } from '@meldingen/form-renderer'

// TODO: fix types
export type Props = {
  action: any
  formComponents: Component[]
  previousPanelPath: string
}

const initialState: { errorMessage?: string; formData?: FormData } = {}

export const AdditionalQuestions = ({ action, formComponents }: Props) => {
  const [{ formData, errorMessage }, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')

  const prefilledFormComponents = formComponents.map((component) => {
    if (isSelectboxes(component)) {
      const defaultValues = component.values.map(({ value }) => {
        const checked = formData?.get(`checkbox___${component.key}___${value}`) === 'on'
        return checked ? value : undefined
      })

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
      <Heading level={1}>{t('step.title')}</Heading>
      <FormRenderer
        formComponents={prefilledFormComponents}
        action={formAction}
        submitButtonText={t('submit-button')}
      />
    </>
  )
}
