'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import type { Component } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { FormHeader } from '../../../_components/FormHeader/FormHeader'

const getPrefilledFormComponents = (components: Component[], formData?: FormData): Component[] =>
  components.map((component) => {
    if (isSelectboxes(component)) {
      const defaultValues = component.values.map(({ value }) => formData?.get(`checkbox___${component.key}___${value}`))

      return { ...component, defaultValues }
    }

    const formValue = formData?.get(component.key)

    if (typeof formValue === 'string') {
      return { ...component, defaultValue: formValue }
    }

    return component
  })

export type ValidationError = {
  key: string
  message: string
}

const mapValidationErrors = (errors?: ValidationError[]) =>
  errors?.map((validationError) => ({
    id: `#${validationError.key}`,
    label: validationError.message,
  })) || []

// TODO: fix types
export type Props = {
  action: any
  formComponents: Component[]
  panelLabel: string
  previousPanelPath: string
}

const initialState: { errorMessage?: string; formData?: FormData; validationErrors?: ValidationError[] } = {}

export const AdditionalQuestions = ({ action, formComponents, panelLabel }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, errorMessage, validationErrors }, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')
  const tShared = useTranslations('shared')

  const prefilledFormComponents = getPrefilledFormComponents(formComponents, formData)

  // Set focus on InvalidFormAlert when there are validation errors
  useEffect(() => {
    if (invalidFormAlertRef.current && validationErrors) {
      invalidFormAlertRef.current.focus()
    }
  }, [validationErrors])

  // Update document title when there are validation errors
  const [documentTitle, setDocumentTitle] = useState(t('metadata.title'))

  useEffect(() => {
    if (validationErrors) {
      const errorCount = validationErrors.length
      const isSingle = errorCount === 1

      setDocumentTitle(`(${errorCount} ${isSingle ? 'invoerfout' : 'invoerfouten'}) ${t('metadata.title')}`)
    }
  }, [validationErrors])

  return (
    <>
      <title>{documentTitle}</title>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}
      <FormHeader title={t('title')} step={t('step')} />
      {validationErrors && (
        <InvalidFormAlert
          className="ams-mb-m"
          errors={mapValidationErrors(validationErrors)}
          heading={tShared('invalid-form-alert-title')}
          headingLevel={2}
          ref={invalidFormAlertRef}
        />
      )}
      <FormRenderer
        formComponents={prefilledFormComponents}
        action={formAction}
        panelLabel={panelLabel}
        submitButtonText={t('submit-button')}
        validationErrors={validationErrors}
      />
    </>
  )
}
