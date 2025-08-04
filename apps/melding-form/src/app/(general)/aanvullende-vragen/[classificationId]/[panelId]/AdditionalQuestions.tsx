'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import type { Component } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { FormHeader } from '../../../_components/FormHeader/FormHeader'
import { FormState, ValidationError } from 'apps/melding-form/src/types'

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

const mapValidationErrors = (errors: ValidationError[]) =>
  errors.map((validationError) => ({
    id: `#${validationError.key}`,
    label: validationError.message,
  }))

export type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  formComponents: Component[]
  panelLabel: string
  previousPanelPath: string
}

const initialState: FormState = {}

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

      setDocumentTitle(`${tShared('error-count-label', { count: errorCount })} ${t('metadata.title')}`)
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
      {validationErrors && (
        <InvalidFormAlert
          className="ams-mb-m"
          errors={mapValidationErrors(validationErrors)}
          heading={tShared('invalid-form-alert-title')}
          headingLevel={2}
          ref={invalidFormAlertRef}
        />
      )}
      <FormHeader title={t('title')} step={t('step')} />
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
